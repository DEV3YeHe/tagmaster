const addFilesButton = document.getElementById("addFilesButton");
const fileList = document.getElementById("fileList");
const fileEntries = new Map();

addFilesButton.addEventListener("click", () => {
  // 打开文件选择器
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".jpg,.png,.txt";
  input.multiple = true;
  input.onchange = handleFiles;
  input.click();
});

function handleFiles(event) {
  // 遍历所有选择的文件
  for (const file of event.target.files) {
    // 读取文件为数据 URL
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // 创建一个文件条目
      let fileEntry = fileEntries.get(file.name.split(".")[0]);
      if (!fileEntry) {
        fileEntry = document.createElement("div");
        fileEntry.className = "fileEntry";
        fileEntries.set(file.name.split(".")[0], fileEntry);
        fileList.appendChild(fileEntry);

        // 设置文件编号
        const number = document.createElement("span");
        number.className = "number";
        number.innerText = '名称：'+file.name.split(".")[0];
        fileEntry.insertBefore(number, fileEntry.firstChild);
      }

      // 创建图片元素并设置 src 属性
if (file.type === "image/jpeg" || file.type === "image/png") {
  const imgWrapper = document.createElement("div");
  imgWrapper.className = "img";
  const img = document.createElement("img");
  img.src = reader.result;
  img.alt = file.name;
  imgWrapper.appendChild(img);
  fileEntry.appendChild(imgWrapper);
  img.addEventListener("click", (e) => {
    if (img.classList.contains("enlarge")) {
      img.classList.remove("enlarge");
    } else {
      img.classList.add("enlarge");
    }
  });
  let text = fileEntry.querySelector("textarea");
  if (!text) {
    text = document.createElement("textarea");
    text.className = "text";
    fileEntry.appendChild(text);
    // 创建保存编辑按钮
    const saveButton = document.createElement("button");
    saveButton.innerText = "保存编辑";
    saveButton.onclick = () => {
      // 生成新的txt文件
      const modifiedText = text.value;
      const fileName = file.name.split(".")[0] + ".txt";
      const blob = new Blob([modifiedText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // 显示保存成功或保存失败的提示
      const saveResult = document.createElement("span");
      saveResult.innerText = "保存" + (link.href ? "成功" : "失败");
      saveResult.style.color = link.href ? "green" : "red";
      fileEntry.appendChild(saveResult);
    };
    fileEntry.appendChild(saveButton);
  }
}

// 如果是文本文件，则创建一个文本元素
if (file.type === "text/plain") {
  const text = document.createElement("textarea");
  reader.readAsText(file);
  reader.onload = () => {
    text.value = reader.result;
  };
  fileEntry.appendChild(text);

  // 添加“保存”按钮
  const saveButton = document.createElement("button");
  saveButton.innerText = "保存编辑";
  saveButton.onclick = () => {
    // 将修改后的文本内容写入原始文件中
    const modifiedText = text.value;
    const blob = new Blob([modifiedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // 显示保存成功或保存失败的提示
    const saveResult = document.createElement("span");
    saveResult.innerText = "保存" + (link.href ? "成功" : "失败");
    saveResult.style.color = link.href ? "green" : "red";
    fileEntry.appendChild(saveResult);

    // 更新文本框中的内容
    text.value = modifiedText;
  };
  fileEntry.appendChild(saveButton);
}


    };
  }
}
