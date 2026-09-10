document.addEventListener('DOMContentLoaded', () => {
	const header = document.querySelector('.site-header');
	const hero = document.querySelector('.hero');
	const navLinks = Array.from(document.querySelectorAll('.nav-link'));
	const sections = navLinks.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
	const timeline = document.querySelector('[data-timeline]');
	const timelineRange = timeline && timeline.querySelector('input[type="range"]');
	const timelineStages = timeline ? Array.from(timeline.querySelectorAll('.timeline-stage')) : [];
	const timelineDescription = timeline && timeline.querySelector('[data-description]');
	const timelineDescriptions = [
		'Sensores medem a umidade, a temperatura e os nutrientes presentes no solo.',
		'As leituras são enviadas para a plataforma, mesmo em áreas com pouca infraestrutura.',
		'O sistema interpreta os dados e identifica o que a plantação precisa naquele momento.',
		'Com a necessidade detectada, o AllpaSense aciona a irrigação ou sugere a correção de acidez.',
		'O manejo fica mais preciso: menos desperdício, solo equilibrado e uma plantação mais saudável.'
	];

	function updateTimeline() {
		if (!timelineRange) return;
		const activeStage = Number(timelineRange.value);
		timeline.style.setProperty('--timeline-progress', `${(activeStage / (timelineDescriptions.length - 1)) * 100}%`);
		timelineStages.forEach((stage, index) => stage.classList.toggle('is-active', index === activeStage));
		if (timelineDescription) timelineDescription.textContent = timelineDescriptions[activeStage];
	}

	if (timelineRange) {
		timelineRange.addEventListener('input', updateTimeline);
		timelineStages.forEach(stage => stage.addEventListener('click', () => {
			timelineRange.value = stage.dataset.stage;
			updateTimeline();
		}));
		updateTimeline();
	}

	function updateHeader() {
		if (!hero) return;
		const heroBottom = hero.getBoundingClientRect().bottom;
		if (heroBottom <= header.offsetHeight + 8) header.classList.add('scrolled');
		else header.classList.remove('scrolled');
	}

	function updateActiveLink(){
		const offset = header.offsetHeight + 24;
		let current = sections[0] && sections[0].id;
		for (const sec of sections) {
			const top = sec.getBoundingClientRect().top;
			if (top <= offset) current = sec.id;
		}
		navLinks.forEach(a => {
			const href = a.getAttribute('href').replace('#','');
			a.classList.toggle('active', href === current);
		});
	}

	navLinks.forEach(a => {
		a.addEventListener('click', e => {
			e.preventDefault();
			const id = a.getAttribute('href').slice(1);
			const target = document.getElementById(id);
			if (!target) return;
			const y = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 12;
			window.scrollTo({top: y, behavior: 'smooth'});
		});
	});

	window.addEventListener('scroll', () => {
		updateHeader();
		updateActiveLink();
	}, {passive:true});

	// initial
	updateHeader();
	updateActiveLink();
});
