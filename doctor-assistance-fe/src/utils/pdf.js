import html2pdf from 'html2pdf.js';

export const handleDownloadPDF = (elementId, filename) => {
  const formClone = document.getElementById(elementId).cloneNode(true);

  const addButtons = formClone.querySelectorAll('.actionButton');
  if (addButtons.length > 0) {
    addButtons.forEach(button => button.remove());
  }

  formClone.querySelectorAll('textarea').forEach((textarea) => {
    const div = document.createElement('div');
    div.textContent = textarea.value;
    div.style.whiteSpace = 'pre-wrap';
    div.style.fontSize = '14px';
    div.className = textarea.className;
    textarea.replaceWith(div);
  });

  formClone.style.height = 'auto';
  formClone.style.overflow = 'visible';

  html2pdf()
    .from(formClone)
    .set({
      margin: 1,
      filename: filename,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    })
    .save();
};

