/**
 * HAYASHI & CO. - Global Automotive Export
 * Interactive RFQ Controller, Multi-File Handler & Netlify Submission Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Footer Year
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 2. Header Scroll Elevation
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
    } else {
      header.style.boxShadow = 'none';
    }
  });

  // 3. Tab Switching: Option A (Part Number) vs Option B (Look-up / Unknown)
  const tabPartNo = document.getElementById('tabPartNo');
  const tabLookup = document.getElementById('tabLookup');
  const panelPartNo = document.getElementById('panelPartNo');
  const panelLookup = document.getElementById('panelLookup');

  const partNumberInput = document.getElementById('partNumberInput');
  const vinInput = document.getElementById('vinInput');
  const carModelInput = document.getElementById('carModelInput');

  const requestModeInput = document.getElementById('requestModeInput');

  let activeMode = 'partNo'; // 'partNo' | 'lookup'

  function switchTab(mode) {
    activeMode = mode;
    if (mode === 'partNo') {
      if (requestModeInput) requestModeInput.value = 'Known Part Number (Option A)';
      tabPartNo.classList.add('active');
      tabPartNo.setAttribute('aria-selected', 'true');
      tabLookup.classList.remove('active');
      tabLookup.setAttribute('aria-selected', 'false');

      panelPartNo.classList.add('active');
      panelPartNo.removeAttribute('hidden');
      panelLookup.classList.remove('active');
      panelLookup.setAttribute('hidden', '');

      partNumberInput.setAttribute('required', '');
      vinInput.removeAttribute('required');
      carModelInput.removeAttribute('required');
    } else {
      if (requestModeInput) requestModeInput.value = 'Lookup / Unknown Part Number (Option B)';
      tabLookup.classList.add('active');
      tabLookup.setAttribute('aria-selected', 'true');
      tabPartNo.classList.remove('active');
      tabPartNo.setAttribute('aria-selected', 'false');

      panelLookup.classList.add('active');
      panelLookup.removeAttribute('hidden');
      panelPartNo.classList.remove('active');
      panelPartNo.setAttribute('hidden', '');

      partNumberInput.removeAttribute('required');
      vinInput.setAttribute('required', '');
      carModelInput.setAttribute('required', '');
    }
    updateLiveSummary();
  }

  tabPartNo.addEventListener('click', () => switchTab('partNo'));
  tabLookup.addEventListener('click', () => switchTab('lookup'));

  // 4. Above-the-Fold Quick Quote Fast Bridge (CRO Feature)
  const quickQuoteForm = document.getElementById('quickQuoteForm');
  const quickPartInput = document.getElementById('quickPartInput');
  const rfqSection = document.getElementById('rfq-section');

  if (quickQuoteForm) {
    quickQuoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = quickPartInput.value.trim();
      if (!query) return;

      // Scroll smoothly down to the RFQ form
      rfqSection.scrollIntoView({ behavior: 'smooth' });

      // Intelligent detection: If query looks like a vehicle name, chassis code, or part description
      const isChassisOrText = /(skyline|supra|rx7|rx-7|gt-r|gtr|bnr|bcnr|hcr|jza|s13|s14|s15|na6|na8|fd3s|fc3s|dc2|ek9|acty|carry|hijet|sambar|kei|truck|land cruiser|cruiser|hzj|hdj|jimny|delica|head|turbo|brake|bumper|carburetor|clutch|hub|axle)/i.test(query);

      setTimeout(() => {
        if (isChassisOrText) {
          switchTab('lookup');
          vinInput.value = query;
          vinInput.focus();
        } else {
          switchTab('partNo');
          partNumberInput.value = query;
          partNumberInput.focus();
        }
        updateLiveSummary();
      }, 400);
    });
  }

  // 5. Heavy / Oversized Freight Checkbox
  const oversizedItemCheck = document.getElementById('oversizedItemCheck');
  const oversizedAlertBox = document.getElementById('oversizedAlertBox');

  oversizedItemCheck.addEventListener('change', () => {
    if (oversizedItemCheck.checked) {
      oversizedAlertBox.removeAttribute('hidden');
    } else {
      oversizedAlertBox.setAttribute('hidden', '');
    }
    updateLiveSummary();
  });

  // 6. Multi-Photo Upload Handling (1 to 10 photos, max 15MB total)
  const photoUploadInput = document.getElementById('photoUploadInput');
  const fileDropZone = document.getElementById('fileDropZone');
  const fileUploadStatus = document.getElementById('fileUploadStatus');
  let selectedFiles = [];

  function handleFilesSelected(fileList) {
    const rawFiles = Array.from(fileList);
    if (rawFiles.length === 0) return;

    if (rawFiles.length > 10) {
      alert("Please select up to 10 photos. You can email additional photos directly to contact@hayashi-and-co.com.");
      selectedFiles = rawFiles.slice(0, 10);
    } else {
      selectedFiles = rawFiles;
    }

    let totalSizeBytes = 0;
    selectedFiles.forEach(f => totalSizeBytes += f.size);
    const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

    if (totalSizeBytes > 15 * 1024 * 1024) {
      fileUploadStatus.innerHTML = `<span style="color: var(--accent-gold);">⚠️ Selected ${selectedFiles.length} photos (${totalSizeMB} MB). Exceeds 15MB limit. Please reduce image sizes or email us directly.</span>`;
      fileDropZone.style.borderColor = 'var(--accent-gold)';
    } else {
      const fileNames = selectedFiles.map(f => f.name).join(", ");
      fileUploadStatus.innerHTML = `✓ Attached ${selectedFiles.length} photo(s) (${totalSizeMB} MB total)<br><small style="color: var(--text-muted);">${fileNames}</small>`;
      fileDropZone.style.borderColor = 'var(--accent-emerald)';
    }
    updateLiveSummary();
  }

  photoUploadInput.addEventListener('change', (e) => {
    if (e.target.files) {
      handleFilesSelected(e.target.files);
    }
  });

  // Drag and drop events
  ['dragenter', 'dragover'].forEach(eventName => {
    fileDropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      fileDropZone.style.borderColor = 'var(--accent-cyan)';
      fileDropZone.style.backgroundColor = 'rgba(37, 99, 235, 0.12)';
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    fileDropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      fileDropZone.style.backgroundColor = 'rgba(6, 13, 23, 0.4)';
    });
  });

  fileDropZone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files);
    }
  });

  // 7. Live RFQ Preview Summary
  const summaryBodyText = document.getElementById('summaryBodyText');
  const companyNameInput = document.getElementById('companyNameInput');
  const contactEmailInput = document.getElementById('contactEmailInput');
  const destinationCountry = document.getElementById('destinationCountry');
  const partBrandSelect = document.getElementById('partBrandSelect');

  function getConditionPref() {
    const radio = document.querySelector('input[name="condition_preference"]:checked');
    return radio ? radio.value : 'Brand New OEM';
  }

  function updateLiveSummary() {
    const company = companyNameInput.value.trim() || 'Your Company';
    const email = contactEmailInput.value.trim() || 'your-email@domain.com';
    const country = destinationCountry.value || 'Western Destination';
    const condition = getConditionPref();
    const isHeavy = oversizedItemCheck.checked;

    let partInfo = '';
    if (activeMode === 'partNo') {
      const partNum = partNumberInput.value.trim() || '[OEM Part #]';
      const category = partBrandSelect.value;
      partInfo = `<span class="summary-tag">Part: ${partNum}</span> <span class="summary-tag">Category: ${category}</span>`;
    } else {
      const vin = vinInput.value.trim() || '[Chassis/VIN]';
      const car = carModelInput.value.trim() || '[Vehicle Model]';
      partInfo = `<span class="summary-tag">Lookup: ${car}</span> <span class="summary-tag">VIN: ${vin}</span>`;
      if (selectedFiles.length > 0) {
        partInfo += ` <span class="summary-tag">${selectedFiles.length} Photo(s) Attached</span>`;
      }
    }

    const heavyTag = isHeavy ? `<span class="summary-tag gold">Heavy Assembly / Crate Service</span>` : '';
    const conditionTag = `<span class="summary-tag">${condition}</span>`;
    const destTag = `<span class="summary-tag">To: ${country}</span>`;

    summaryBodyText.innerHTML = `
      <strong>Requesting for ${company} (${email})</strong><br>
      ${partInfo} ${conditionTag} ${destTag} ${heavyTag}
    `;
  }

  // Bind live preview listeners
  [
    partNumberInput, vinInput, carModelInput, companyNameInput,
    contactEmailInput, destinationCountry, partBrandSelect
  ].forEach(el => {
    if (el) el.addEventListener('input', updateLiveSummary);
  });

  document.querySelectorAll('input[name="condition_preference"]').forEach(radio => {
    radio.addEventListener('change', updateLiveSummary);
  });

  // 8. RFQ Form Submission (Netlify Forms Engine & Modal Flow)
  const rfqForm = document.getElementById('rfqForm');
  const submitRfqBtn = document.getElementById('submitRfqBtn');
  const successModal = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalSummaryContent = document.getElementById('modalSummaryContent');

  rfqForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable button & show sending state
    const originalBtnText = submitRfqBtn.innerHTML;
    submitRfqBtn.disabled = true;
    submitRfqBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>
      <span>Submitting RFQ to Japan...</span>
    `;

    // Collect values
    const company = companyNameInput.value.trim();
    const email = contactEmailInput.value.trim();
    const country = destinationCountry.value;
    const condition = getConditionPref();
    const isHeavy = oversizedItemCheck.checked;

    let detailsHtml = '';
    if (activeMode === 'partNo') {
      detailsHtml = `
        <p><strong>Request Type:</strong> Known Part Number</p>
        <p><strong>OEM Number:</strong> ${partNumberInput.value.trim()}</p>
        <p><strong>Category:</strong> ${partBrandSelect.value}</p>
      `;
    } else {
      detailsHtml = `
        <p><strong>Request Type:</strong> Parts Lookup Service</p>
        <p><strong>Vehicle:</strong> ${carModelInput.value.trim()}</p>
        <p><strong>Chassis / VIN:</strong> ${vinInput.value.trim()}</p>
        <p><strong>Attached Photos:</strong> ${selectedFiles.length > 0 ? selectedFiles.length + ' file(s)' : 'None (Text description only)'}</p>
      `;
    }

    modalSummaryContent.innerHTML = `
      <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Destination:</strong> ${country}</p>
        <p><strong>Official Quote Sent To:</strong> <span style="color: var(--accent-cyan);">${email}</span></p>
        <p><strong>Condition Preference:</strong> ${condition}</p>
        ${isHeavy ? '<p style="color: var(--accent-gold);"><strong>Logistics:</strong> Special ISPM-15 Wood Crate / Freight Routing</p>' : ''}
      </div>
      ${detailsHtml}
      <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); color: var(--accent-emerald);">
        🛡️ Protected by PayPal Commercial Invoicing upon final agreement.
      </div>
    `;

    // Attempt Netlify Forms POST
    try {
      const formData = new FormData(rfqForm);
      // Ensure drag-and-dropped photos are attached to formData
      if (selectedFiles.length > 0) {
        formData.delete('photos');
        selectedFiles.forEach((file) => {
          formData.append('photos', file, file.name);
        });
      }
      await fetch("/", {
        method: "POST",
        body: formData
      });
    } catch (err) {
      console.warn("Netlify Forms POST fallback (normal in local preview):", err);
    } finally {
      // Re-enable button
      submitRfqBtn.disabled = false;
      submitRfqBtn.innerHTML = originalBtnText;

      // Open Success Modal
      successModal.classList.add('active');
      successModal.setAttribute('aria-hidden', 'false');
    }
  });

  modalCloseBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
    successModal.setAttribute('aria-hidden', 'true');
    rfqForm.reset();
    selectedFiles = [];
    fileUploadStatus.textContent = '';
    fileDropZone.style.borderColor = 'rgba(255, 255, 255, 0.18)';
    oversizedAlertBox.setAttribute('hidden', '');
    switchTab('partNo');
    updateLiveSummary();
  });

  // Close modal when clicking outside
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      modalCloseBtn.click();
    }
  });

  // 9. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Initial live summary run
  updateLiveSummary();
});
