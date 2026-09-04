document.addEventListener('DOMContentLoaded', () => {
	const header = document.querySelector('.site-header');
	const hero = document.querySelector('.hero');
	const navLinks = Array.from(document.querySelectorAll('.nav-link'));
	const sections = navLinks.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);

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
