// --- Elements ---
const planEl = document.getElementById("plan");
const cancelEl = document.getElementById("cancel");
const domainEl = document.getElementById("domain");
const deadlineEl = document.getElementById("deadline");
const subjectOut = document.getElementById("subjectOut");
const bodyOut = document.getElementById("bodyOut");
const editDeadlineBtn = document.getElementById("editDeadline");

// --- Deadline: 7 days from today ---
function computeDeadline() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
deadlineEl.value = computeDeadline();

// --- Templates ---
function buildSubject(domain) {
  return `Action needed: your custom domain ${domain} will be removed in 7 days`;
}

function buildBody(plan, cancelDate, domain, deadline) {
  return `Hello,

We hope you're doing well.

We noticed that your <strong>${plan}</strong> subscription was cancelled on <strong>${cancelDate}</strong>.
However, your custom domain ${domain} is still connected to your website.
Please note that the custom domain connection is a premium feature available only with an active paid subscription.
To continue using ${domain}, please resubscribe to a paid plan by <strong>${deadline}</strong>. 
After this period, we will remove the custom domain connection from our end.
If you have any questions or need assistance with resubscribing or disconnecting your domain, please feel free to reply to this email.
We'll be happy to help.

Best regards,
The Dorik Support Team`;
}

// --- Render (live) ---
function render() {
  const plan = planEl.value.trim() || "[plan_name]";
  const cancelDate = cancelEl.value.trim() || "[cancellation_date]";
  const domain = domainEl.value.trim() || "[domain]";
  const deadline = deadlineEl.value.trim() || "[deadline]";

  subjectOut.textContent = buildSubject(domain);
  bodyOut.innerHTML = buildBody(plan, cancelDate, domain, deadline);
}

[planEl, cancelEl, domainEl, deadlineEl].forEach((el) =>
  el.addEventListener("input", render)
);

// --- Editable deadline toggle ---
editDeadlineBtn.addEventListener("click", () => {
  const locked = deadlineEl.hasAttribute("readonly");
  if (locked) {
    deadlineEl.removeAttribute("readonly");
    deadlineEl.focus();
    editDeadlineBtn.textContent = "Reset to 7 days";
  } else {
    deadlineEl.setAttribute("readonly", "");
    deadlineEl.value = computeDeadline();
    editDeadlineBtn.textContent = "Edit manually";
    render();
  }
});

// --- Copy buttons ---
function flash(btn, label) {
  const original = btn.textContent;
  btn.textContent = label;
  btn.classList.add("done");
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove("done");
  }, 1500);
}

document.querySelectorAll(".copy").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    navigator.clipboard
      .writeText(target.textContent)
      .then(() => flash(btn, "Copied"));
  });
});

document.getElementById("copyAll").addEventListener("click", (e) => {
  const full = `Subject: ${subjectOut.textContent}\n\n${bodyOut.textContent}`;
  navigator.clipboard.writeText(full).then(() => flash(e.target, "Copied full email"));
});

// --- Initial paint ---
render();
