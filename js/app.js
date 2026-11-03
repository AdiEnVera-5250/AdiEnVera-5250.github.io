import { content } from "../content.js";

const DEFAULT_LANGUAGE = "es";
const SUPPORTED_LANGUAGES = ["es", "en"];
const STORAGE_KEY = "lang";

const ui = {
  es: {
    headings: {
      about: "Sobre mí",
      education: "Educación",
      skills: "Habilidades",
      projects: "Proyectos",
      contact: "Contacto"
    },
    status: {
      "en-progreso": "En progreso",
      completado: "Completado"
    },
    labels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      project: "Ver proyecto",
      language: "Idioma"
    },
    missingContent: "Falta contenido en content.js"
  },
  en: {
    headings: {
      about: "About",
      education: "Education",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact"
    },
    status: {
      "en-progreso": "In progress",
      completado: "Completed"
    },
    labels: {
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      project: "View project",
      language: "Language"
    },
    missingContent: "Falta contenido en content.js"
  }
};

const templates = {
  education: document.getElementById("tpl-education-item"),
  skillGroup: document.getElementById("tpl-skill-group"),
  project: document.getElementById("tpl-project-card")
};

const elements = {
  warning: document.getElementById("content-warning"),
  heroName: document.getElementById("hero-name"),
  heroTagline: document.getElementById("hero-tagline"),
  heroStatus: document.getElementById("hero-status"),
  heroStatusText: document.getElementById("hero-status-text"),
  heroLinks: document.getElementById("hero-links"),
  aboutText: document.getElementById("about-text"),
  educationList: document.getElementById("education-list"),
  skillsList: document.getElementById("skills-list"),
  projectsList: document.getElementById("projects-list"),
  contactLinks: document.getElementById("contact-links"),
  languageSwitch: document.getElementById("lang-switch")
};

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

function readStoredLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    // localStorage lanza si el navegador bloquea el almacenamiento.
    return DEFAULT_LANGUAGE;
  }
}

function storeLanguage(language) {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // La preferencia no persiste si el navegador bloquea el almacenamiento.
  }
}

function createLink({ label, href, external = false }) {
  const anchor = document.createElement("a");
  anchor.className = "text-link";
  anchor.textContent = label;
  anchor.href = href.trim();
  if (external) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
  return anchor;
}

function renderLinkList(list, links) {
  list.replaceChildren();
  links
    .filter((link) => hasText(link.href))
    .forEach((link) => {
      const item = document.createElement("li");
      item.append(createLink(link));
      list.append(item);
    });
  list.hidden = list.childElementCount === 0;
}

function setOptionalText(element, value) {
  const text = hasText(value) ? value.trim() : "";
  element.textContent = text;
  element.hidden = text === "";
}

function setSectionVisibility(sectionId, visible) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.hidden = !visible;
  }
  return visible;
}

function renderHero(hero, labels) {
  const data = hero ?? {};
  const name = hasText(data.name) ? data.name.trim() : "";
  const tagline = hasText(data.tagline) ? data.tagline.trim() : "";
  const status = hasText(data.status) ? data.status.trim() : "";
  const email = hasText(data.email) ? data.email.trim() : "";

  elements.heroName.textContent = name;
  elements.heroTagline.textContent = tagline;
  elements.heroTagline.hidden = tagline === "";
  elements.heroStatusText.textContent = status;
  elements.heroStatus.hidden = status === "";

  renderLinkList(elements.heroLinks, [
    { label: labels.labels.email, href: email === "" ? "" : `mailto:${email}` },
    { label: labels.labels.linkedin, href: data.linkedin, external: true },
    { label: labels.labels.github, href: data.github, external: true }
  ]);

  return name !== "" && tagline !== "" && email !== "";
}

function renderAbout(about) {
  const text = hasText(about) ? about.trim() : "";
  elements.aboutText.textContent = text;
  return setSectionVisibility("about", text !== "");
}

function renderEducation(entries) {
  const list = Array.isArray(entries) ? entries : [];
  const validEntries = list.filter(
    (entry) => hasText(entry?.institution) && hasText(entry?.degree)
  );

  elements.educationList.replaceChildren();
  validEntries.forEach((entry) => {
    const node = templates.education.content.cloneNode(true);
    node.querySelector(".entry-institution").textContent = entry.institution.trim();
    node.querySelector(".entry-degree").textContent = entry.degree.trim();
    setOptionalText(node.querySelector(".entry-period"), entry.period);
    setOptionalText(node.querySelector(".entry-note"), entry.note);
    elements.educationList.append(node);
  });

  return setSectionVisibility("education", validEntries.length > 0);
}

function renderSkills(groups) {
  const list = Array.isArray(groups) ? groups : [];
  const validGroups = list
    .map((group) => ({
      name: hasText(group?.group) ? group.group.trim() : "",
      items: Array.isArray(group?.items)
        ? group.items.filter(hasText).map((item) => item.trim())
        : []
    }))
    .filter((group) => group.name !== "" && group.items.length > 0);

  elements.skillsList.replaceChildren();
  validGroups.forEach((group) => {
    const node = templates.skillGroup.content.cloneNode(true);
    node.querySelector(".skill-group-title").textContent = group.name;
    const itemList = node.querySelector(".skill-list");
    group.items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      itemList.append(listItem);
    });
    elements.skillsList.append(node);
  });

  return setSectionVisibility("skills", validGroups.length > 0);
}

function renderProjects(projects, labels) {
  const list = Array.isArray(projects) ? projects : [];
  const validProjects = list.filter(
    (project) => hasText(project?.title) && hasText(project?.problem)
  );

  elements.projectsList.replaceChildren();
  validProjects.forEach((project) => {
    const node = templates.project.content.cloneNode(true);
    node.querySelector(".project-card-title").textContent = project.title.trim();
    node.querySelector(".project-card-problem").textContent = project.problem.trim();
    setOptionalText(node.querySelector(".project-card-approach"), project.approach);

    const chip = node.querySelector(".chip");
    const status = hasText(project.status) ? project.status.trim() : "";
    if (status !== "" && hasText(labels.status[status])) {
      chip.textContent = labels.status[status];
    } else {
      chip.remove();
    }

    const linksList = node.querySelector(".project-card-links");
    const projectLinks = Array.isArray(project.links) ? project.links : [];
    projectLinks
      .filter((entry) => hasText(entry?.url))
      .forEach((entry) => {
        const item = document.createElement("li");
        const anchor = createLink({
          label: hasText(entry.label) ? entry.label.trim() : labels.labels.project,
          href: entry.url,
          external: true
        });
        anchor.classList.add("project-card-link");
        item.append(anchor);
        linksList.append(item);
      });
    linksList.hidden = linksList.childElementCount === 0;

    elements.projectsList.append(node);
  });

  return setSectionVisibility("projects", validProjects.length > 0);
}

function renderContact(contact, labels) {
  const data = contact ?? {};
  const email = hasText(data.email) ? data.email.trim() : "";

  renderLinkList(elements.contactLinks, [
    { label: labels.labels.email, href: email === "" ? "" : `mailto:${email}` },
    { label: labels.labels.linkedin, href: data.linkedin, external: true },
    { label: labels.labels.github, href: data.github, external: true }
  ]);

  return setSectionVisibility("contact", email !== "");
}

function updateHeadings(labels) {
  document.querySelectorAll("[data-heading]").forEach((heading) => {
    heading.textContent = labels.headings[heading.dataset.heading] ?? "";
  });
}

function updateLanguageSwitch(language, labels) {
  elements.languageSwitch.setAttribute("aria-label", labels.labels.language);
  elements.languageSwitch.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
}

function updateDocumentMeta(hero) {
  if (!hasText(hero?.name)) {
    return;
  }
  document.title = hero.name.trim();
  if (hasText(hero.tagline)) {
    document.querySelector('meta[name="description"]')?.setAttribute("content", hero.tagline.trim());
  }
}

function applyLanguage(language) {
  const locale = content[language] ? language : DEFAULT_LANGUAGE;
  const data = content[locale] ?? {};
  const labels = ui[locale] ?? ui[DEFAULT_LANGUAGE];

  document.documentElement.lang = locale;
  updateHeadings(labels);
  updateLanguageSwitch(locale, labels);

  const heroComplete = renderHero(data.hero, labels);
  updateDocumentMeta(data.hero);
  renderAbout(data.about);
  renderEducation(data.education);
  renderSkills(data.skills);
  renderProjects(data.projects, labels);
  renderContact(data.contact, labels);

  elements.warning.textContent = labels.missingContent;
  elements.warning.hidden = heroComplete;
}

elements.languageSwitch.querySelectorAll("[data-language]").forEach((button) => {
  button.addEventListener("click", () => {
    storeLanguage(button.dataset.language);
    applyLanguage(button.dataset.language);
  });
});

applyLanguage(readStoredLanguage());
