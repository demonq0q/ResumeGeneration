import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPDF(
  element: HTMLElement,
  filename: string = 'resume.pdf'
): Promise<void> {
  // 克隆元素以避免影响原始 DOM
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // 临时添加到 body 用于渲染
  clonedElement.style.position = 'absolute';
  clonedElement.style.left = '-9999px';
  clonedElement.style.top = '0';
  document.body.appendChild(clonedElement);

  // 获取实际内容高度
  const contentHeight = clonedElement.scrollHeight;
  
  // 设置固定高度为内容高度，避免多余空白
  clonedElement.style.minHeight = 'auto';
  clonedElement.style.maxHeight = 'none';
  clonedElement.style.height = `${contentHeight}px`;

  try {
    // 使用更高的 scale 提升清晰度
    const canvas = await html2canvas(clonedElement, {
      scale: 3, // 提高到 3 倍，增强清晰度
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: clonedElement.scrollWidth,
      windowHeight: contentHeight,
      imageTimeout: 0,
      removeContainer: true,
      allowTaint: false,
    });

    // A4 尺寸 (mm)
    const a4Width = 210;
    const a4Height = 297;
    
    // 计算实际内容对应的 PDF 高度
    const imgWidth = a4Width;
    const imgHeight = (canvas.height * a4Width) / canvas.width;

    // 创建 PDF，只包含实际内容
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // 如果内容高度小于一页，只创建一页
    if (imgHeight <= a4Height) {
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.98), // 使用 JPEG 格式，质量 98%
        'JPEG',
        0,
        0,
        imgWidth,
        imgHeight
      );
    } else {
      // 如果内容超过一页，分页处理
      let heightLeft = imgHeight;
      let position = 0;
      let page = 0;

      while (heightLeft > 0) {
        if (page > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.98),
          'JPEG',
          0,
          position,
          imgWidth,
          imgHeight
        );
        
        heightLeft -= a4Height;
        position -= a4Height;
        page++;
      }
    }

    pdf.save(filename);
  } finally {
    // 清理克隆的元素
    document.body.removeChild(clonedElement);
  }
}
