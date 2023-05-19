export class PreventDragClick {
	constructor(elem) {
		this.mouseMoved; // 마우스를 드래그 했는지 true/false
		let clickStartX;
		let clickStartY;
		let clickStartTime;
		elem.addEventListener('mousedown', e => {
			clickStartX = e.clientX;
			clickStartY = e.clientY;
			clickStartTime = Date.now();
		});
		elem.addEventListener('mouseup', e => {
			const xGap = Math.abs(e.clientX - clickStartX);
			const yGap = Math.abs(e.clientY - clickStartY);
			const timeGap = Date.now() - clickStartTime;
			
			if (
				xGap > 5 ||
				yGap > 5 ||
				timeGap > 500
			) {
				this.mouseMoved = true;
			} else {
				this.mouseMoved = false;
			}
		});
	}
}