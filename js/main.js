// 전역변수 대신 지역변수를 쓰는 게 좋다
(() => {

	let yOffset = 0; // window.pageYOffset 대신 쓸 변수
	let prevScrollHeight = 0; // 현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 스크롤 높이들의 합
	let currentScene = 0; // 현재 활성화된 씬
	let enterNewScene = false; // 새로운 scene이 시작된 순간에만 true

	const sceneInfo = [
		{
			// 0
			type: 'sticky',
			heightNum: 5, // 브라우저 높이의 5배로 scollHeight 세팅. 이렇게 하는 이유는 기기마다 높이가 다르기 떄문임.
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-0'),
				messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				messageC: document.querySelector('#scroll-section-0 .main-message.c'),
				messageD: document.querySelector('#scroll-section-0 .main-message.d'),
			},
			values: {
				messageA_opacity: [0, 1]
			}
		},
		{
			// 1
			type: 'normal',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-1'),
			},
		},
		{
			// 2
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-2'),
			},
		},
		{
			// 3
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-3'),
			},
		}
	];

	function setLayout() {
		// 각 스크롤 섹션의 높이 세팅
		for(let i = 0; i < sceneInfo.length; i++) {
			sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
		}

		let totalScrollHeight = 0;
		yOffset = window.pageYOffset
		for (let i = 0; i < sceneInfo.length; i++) {
			totalScrollHeight += sceneInfo[i].scrollHeight;
			if (totalScrollHeight >= yOffset) {
				currentScene = i;
				break;
			}
		}
		document.body.setAttribute('id', `show-scene-${currentScene}`)
	}

	// currentYOffset = 현재 씬에서 얼만큼 스크롤 되었는지에 대한 값
	function calcValues(values, currentYOffset) {
		let rv;
		// 현재 씬(스크롤 섹션)에서 스크롤된 범위를 비율로 계산한 값
		let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight
		rv = scrollRatio * (values[1] - values[0]) + values[0]
		return rv;
	}

	function playAnimation() {
		const objs = sceneInfo[currentScene].objs
		const values = sceneInfo[currentScene].values
		const currentYOffset = yOffset - prevScrollHeight
		
		console.log(currentScene)

		switch (currentScene) {
			case 0: 
				let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset)
				objs.messageA.style.opacity = messageA_opacity_in
				console.log(messageA_opacity_in)
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
		}
	}

	function scrollLoop() {
		enterNewScene = false;
		prevScrollHeight = 0;
		for (let i =0; i < currentScene; i++) {
			prevScrollHeight += sceneInfo[i].scrollHeight
		}

		if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true;
			currentScene++
			// document.body.setAttribute('id', `show-scene-${currentScene}`)
		}
		if (yOffset < prevScrollHeight) {
			if(currentScene === 0 ) return // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
			enterNewScene = true;
			currentScene--
			// document.body.setAttribute('id', `show-scene-${currentScene}`)
		}
		document.body.setAttribute('id', `show-scene-${currentScene}`)

		if(enterNewScene) return;
		playAnimation()
	}

	setLayout();

	window.addEventListener('load', setLayout) // 모~든 리소스들이 로드 끝났을 때.
	// window.addEventListener('DOMcontentLoaded', setLayout) // html 객체들이 로드 끝났을 때. 그래서 img들은 미포함. load보다 실행 시점 빠름.
	window.addEventListener('resize', setLayout)
	window.addEventListener('scroll', () => {
		yOffset = window.pageYOffset;
		scrollLoop();
	})
}) ();