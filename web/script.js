document.getElementById('jobSearchBtn').addEventListener('click', fetchJobs);

async function fetchJobs() {
  const searchTerm = document.getElementById('jobInput').value.trim().toLowerCase();
  const resultsSection = document.getElementById('resultsArea');
  resultsSection.innerHTML = '<p>Looking for jobs...</p>';

  try {
    const response = await fetch('https://remoteok.com/api');
    const jobData = await response.json();

    const inclusiveTags = [
      'nonprofit', 'open source', 'remote', 'junior',
      'diversity', 'developer-friendly', 'self-taught welcome'
    ];

    const matchingJobs = jobData.filter(job => {
      const tags = (job.tags || []).map(tag => tag.toLowerCase());
      const tagMatch = inclusiveTags.some(t => tags.includes(t));
      const keywordMatch = searchTerm === '' || (job.position && job.position.toLowerCase().includes(searchTerm));
      return tagMatch && keywordMatch;
    });

    if (matchingJobs.length === 0) {
      resultsSection.innerHTML = '<p>No matching jobs found. Try another search.</p>';
      return;
    }

    window.jobList = matchingJobs;
    resultsSection.innerHTML = '';

    matchingJobs.forEach((job, i) => {
      const card = document.createElement('div');
      card.className = 'job-card';
      card.innerHTML = `
        <h3>${job.position}</h3>
        <p><strong>${job.company}</strong> – ${job.location || 'Remote'}</p>
        <div class="tag-list">
          ${(job.tags || []).map(tag => `<span class="tag-item">${tag}</span>`).join('')}
        </div>
        <div class="view-btn-container">
          <button onclick="showPopup(${i})">View Job</button>
        </div>
      `;
      resultsSection.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading jobs:', error);
    resultsSection.innerHTML = '<p>Something went wrong. Please try again later.</p>';
  }
}

const popup = document.getElementById('jobPopup');
const popupContent = document.getElementById('popupDetails');
const closeBtn = document.getElementById('closePopup');

window.showPopup = function (jobIndex) {
  const job = window.jobList[jobIndex];
  popupContent.innerHTML = `
    <h2>${job.position}</h2>
    <p><strong>${job.company}</strong> – ${job.location || 'Remote'}</p>
    <div class="tag-list">
      ${(job.tags || []).map(tag => `<span class="tag-item">${tag}</span>`).join('')}
    </div>
    <p style="margin-top:1rem;">This opportunity supports inclusive and remote-first values.</p>
    <a href="${job.url}" target="_blank">Apply on Company Site</a>
  `;
  popup.style.display = 'block';
};

closeBtn.onclick = function () {
  popup.style.display = 'none';
};

window.onclick = function (event) {
  if (event.target === popup) {
    popup.style.display = 'none';
  }
};
