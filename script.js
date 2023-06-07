var clean_images = {};
function change(id) {
  let input = document.getElementById(id);
  let img = document
    .getElementById(id)
    .parentElement.getElementsByClassName("img")[0];
  if (input.files[0]) {
    img.src = URL.createObjectURL(input.files[0]);
    clean_images[id] = img.src;
  }

  input.parentElement.style.overflow = "auto";
  input.nextElementSibling.style.alignItems = "flex-start";
}

function color_change() {
  let color_input = document.getElementById("color").value;
  document.getElementById("img_list").style.backgroundColor = color_input;
}

function copyImagesToFilterPage() {
  let imageContainer = document.getElementById("filter-image-container");
  let images = document
    .getElementById("img_list")
    .getElementsByClassName("img");

  // 기존에 추가된 이미지들을 모두 제거합니다
  while (imageContainer.firstChild) {
    imageContainer.firstChild.remove();
  }

  // img_list 전체를 복사하여 필터 페이지에 추가합니다
  let imgList = document.getElementById("img_list");
  let clonedImgList = imgList.cloneNode(true);

  // 이미지를 클릭했을 때 아무런 동작도 하지 않도록 합니다.
  let clonedImages = clonedImgList.getElementsByClassName("img");
  for (let i = 0; i < clonedImages.length; i++) {
    clonedImages[i].addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }

  // 필터 페이지에 이미지 리스트가 이미 존재한다면 제거합니다
  let existingImgList = imageContainer.querySelector("#img_list");
  if (existingImgList) {
    existingImgList.remove();
  }

  // 필터 페이지에 복사한 이미지 리스트를 추가합니다
  imageContainer.appendChild(clonedImgList);

  document.getElementById("upload").remove();
}

// 필터 버튼 클릭 시 해당 필터를 이미지에 적용합니다
let buttons = document.querySelectorAll(".filter-button");
buttons.forEach((button) => {
  button.addEventListener("click", function () {
    let filter = this.getAttribute("data-filter");
    let images = document
      .getElementById("filter-image-container")
      .getElementsByTagName("img");

    for (let i = 0; i < images.length; i++) {
      let dpr = window.devicePixelRatio || 1; // for hidpi
      console.log(dpr);
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = parseInt(window.getComputedStyle(images[i]).width) * dpr;
      canvas.height = parseInt(window.getComputedStyle(images[i]).height) * dpr;
      console.log(canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      console.log(canvas.width, canvas.height);
      switch (filter) {
        case "brightness":
          ctx.filter = "brightness(110%)";
          break;
        case "contrast":
          ctx.filter = "contrast(110%)";
          break;
        case "saturate":
          ctx.filter = "saturate(120%)";
          break;
        case "sepia":
          ctx.filter = "sepia(110%)";
          break;
        case "grayscale":
          ctx.filter = "grayscale(10%)";
          break;
        case "blur":
          ctx.filter = "blur(2px)";
          break;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(images[i], 0, 0, canvas.width / dpr, canvas.height / dpr);
      let canvas_image = canvas.toDataURL();
      console.log(canvas_image);
      images[i].src = canvas_image;
    }
  });
});

document.getElementById("clear-filters").addEventListener("click", function () {
  let images = document
    .getElementById("filter-image-container")
    .getElementsByTagName("img");
  for (let i = 0; i < images.length; i++) {
    images[i].style.filter = "";
  }
  for (const i in clean_images) {
    console.log(i, clean_images[i]);
    document.getElementById(i).nextElementSibling.childNodes[0].src =
      clean_images[i];
  }
});

function open_color() {
  let color_input = document.getElementById("color");
  //color_input.hidden=false;
  color_input.click();
}

function handleNavigationToUpload(event) {
  let contents = document.getElementsByClassName("content");
  for (let i = 0; i < contents.length; i++) {
    contents[i].style.display = "none";
  }

  let contentId = event.target.getAttribute("data-next-content");
  document.getElementById(contentId).style.display = "block";

  event.stopPropagation(); // Prevent the event from propagating further
}

document
  .querySelector('.page-button[data-next-content="upload"]')
  .addEventListener("click", handleNavigationToUpload);

function handleNavigationToFilter(event) {
  let images = document
    .getElementById("img_list")
    .getElementsByClassName("img");
  let allImagesUploaded = Array.from(images).every(
    (img) => img.src !== "plus.png"
  );

  if (!allImagesUploaded) {
    alert("사진을 모두 업로드해주세요.");
    event.preventDefault(); // 클릭 이벤트가 추가로 진행되는 것을 방지합니다.
    return; // 함수를 종료하여 다음 코드가 실행되지 않게 합니다.
  } else {
    let contents = document.getElementsByClassName("content");
    for (let i = 0; i < contents.length; i++) {
      contents[i].style.display = "none";
    }

    let contentId = event.target.getAttribute("data-next-content");
    document.getElementById(contentId).style.display = "block";

    copyImagesToFilterPage();
  }

  event.stopPropagation(); // Prevent the event from propagating further
}

document
  .querySelector('.page-button[data-next-content="filter"]')
  .addEventListener("click", handleNavigationToFilter);

document
  .querySelector('#navbar a[data-content="filter"]')
  .addEventListener("click", handleNavigationToFilter);

function navigateTo(pageName) {
  let contents = document.getElementsByClassName("content");
  for (let i = 0; i < contents.length; i++) {
    contents[i].style.display = "none";
  }

  if (pageName === "filter") {
    copyImagesToFilterPage();
  }

  document.getElementById(pageName).style.display = "block";
}

function saveAs(uri, filename) {
  var link = document.createElement("a");

  if (typeof link.download === "string") {
    link.href = uri;
    link.download = filename;

    //Firefox requires the link to be in the body
    document.body.appendChild(link);

    //simulate click
    link.click();

    //remove the link when done
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
}

function saveAs(uri, filename) {
  var link = document.createElement("a");

  if (typeof link.download === "string") {
    link.href = uri;
    link.download = filename;

    //Firefox requires the link to be in the body
    document.body.appendChild(link);

    //simulate click
    link.click();

    //remove the link when done
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
}

function donwload_img() {
  console.log("hi");

  html2canvas(document.querySelector("#img_list"), {
    useCORS: true,
    allowTaint: true,
  }).then(function (canvas) {
    console.log(canvas.toDataURL());
    saveAs(canvas.toDataURL(), "HY-4cut.png");
  });
}
