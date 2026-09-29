const dragDirective = {
    name: 'dragDirective',
    bind(el, binding)  {
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;
      let rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      
      //   传入父盒子id,在父盒子中拖拽, 否则全局拖拽
      let {parentId} = binding.value || {};


      const onMouseDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
        isDragging = true;
        offsetX = (event.clientX - el.offsetLeft) / rootFontSize;
        offsetY = (event.clientY - el.offsetTop) / rootFontSize;
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };
  
      const onMouseMove = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isDragging) {
          const newX = (event.clientX - offsetX * rootFontSize) / rootFontSize;
          const newY = (event.clientY - offsetY * rootFontSize) / rootFontSize;
          rootFontSize = parseFloat(
            getComputedStyle(document.documentElement).fontSize
          ); // 更新 rootFontSize
          const screenWidth = window.innerWidth / rootFontSize;
          const screenHeight = window.innerHeight / rootFontSize;
          const boxWidth = el.offsetWidth / rootFontSize;
          const boxHeight = el.offsetHeight / rootFontSize;
  
          let finalX = newX;
          let finalY = newY;
  
          if (newX <= 0) {
            finalX = 0;
          } else if (newX + boxWidth >= screenWidth) {
            finalX = screenWidth - boxWidth;
          }
  
          if (newY <= 0) {
            finalY = 0;
          } else if (newY + boxHeight >= screenHeight) {
            finalY = screenHeight - boxHeight;
          }
        //  传入父盒子id,在父盒子中拖拽
          if (parentId){
            const parentEl = document.getElementById(parentId);
            const parentRect = parentEl.getBoundingClientRect();
            const parentWidth = parentRect.width / rootFontSize;
            const parentHeight = parentRect.height / rootFontSize;

            if (finalX > (parentWidth - boxWidth)) {
                finalX = parentWidth - boxWidth;
            }
            if (finalY > (parentHeight - boxHeight)) {
                finalY = parentHeight - boxHeight; 
            }
          }
  
          el.style.left = `${finalX}rem`;
          el.style.top = `${finalY}rem`;
        }
      };
  
      const onMouseUp = () => {
        isDragging = false;
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
  
      el.addEventListener('mousedown', onMouseDown);
    },
};
    // Vue.directive('dragDirective', dragDirective);
export {
    dragDirective
};