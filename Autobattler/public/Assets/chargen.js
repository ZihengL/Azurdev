_.mixin(_.str.exports());

$.expr[':'].icontains = function(a, i, m) {
  return jQuery(a).innerText.toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};

document.ready(function() {

  let matchBodyColor = true;
  let itemsToDraw = [];
  let itemsMeta = {};
  let params = jHash.value;
  let sheetCredits = [];
  const parsedCredits = loadFile("CREDITS.csv").split("\n");
  let creditColumns = parsedCredits[0];

  let canvas = document.getElementById("spritesheet").get(0);
  let ctx = canvas.getCo.innerText = "2d", { willReadFrequently: true };
  let images = {};
  const universalFrameSize = 64;
  const universalSheetWidth = 832;
  const universalSheetHeight = 1344;

  
  let anim = document.getElementById("previewAnimations").get(0);
  let animCtx = anim.getCo.innerText = "2d";
  let animationItems = [1, 2, 3, 4, 5, 6, 7, 8]; 
  let animRowStart = 8; 
  let animRowNum = 4; 
  let currentAnimationItemIndex = 0;
  let activeCustomAnimation = "";
  let addedCustomAnimations = [];

  
  jHash.change(function() {
    params = jHash.value;
    interpretParams();
    redraw();
    showOrHideElements();
  });

  interpretParams();
  if (Object.keys(params).length == 0) {
    $("input[type=reset]").click();
    setParams();
    selectDefaults();
  }
  redraw();
  showOrHideElements();
  nextFrame();

  $("input[type=radio]").attr('title', function() {
    let name = "";
    if (this.data(`layer_1_${getBodyTypeName()}`)) {
      name = this.data(`layer_1_${getBodyTypeName()}`);
    }
    if (name === "") {
      return "";
    }
    const creditEntry = getCreditFor(name);
    if (creditEntry) {
      let parts = splitCsv(creditEntry);
      if (parts.length == 10) {
        return "Created by: " + parts[2];
      }
    } else {
      console.warn("No credit entry for: ", name);
      return "No credits found for this graphic";
    }
    return creditEntry;
  });

  
  $("input[type=radio]").each(function() {
    this.click(function() {
      if (matchBodyColor) {
        matchBodyColorForThisAsset = this.attr('matchBodyColor')
        if (matchBodyColorForThisAsset && matchBodyColorForThisAsset != 'false') {
          selectColorsToMatch(this.attr('variant'));
        }
      }
      setParams();
      redraw();
      showOrHideElements();
    });
  });

  
  
  $("#chooser ul>li").click(function(event) {
    this.children("span").classList.toggle("condensed").classList.toggle("expanded");
    let $ul = this.children("ul");
    $ul.toggle('slow').promise().done(drawPreviews);
    event.stopPropagation();
  });

  document.getElementById("collapse").click(function() {
    $("#chooser>ul ul").hide('slow');
    $("#chooser>ul span.expanded").classList.remove("expanded").classList.add("condensed");
  });
  document.getElementById("expand").click(function() {
    let parents = $('input[type="radio"]:checked').parents("ul")
    parents.prev('span').classList.add("expanded")
    parents.style.display = "".promise().done(drawPreviews)
  })

  function search(e) {
    document.getElementByClassName("search-result").classList.remove("search-result")
    let query = document.getElementById("searchbox").value
    if (query != '' && query.length > 1) {
      let results = $('#chooser span:icontains('+query+')').classList.add("search-result")
      let parents = results.parents("ul")
      parents.prev('span').classList.add("expanded").classList.remove("condensed")
      parents.style.display = "".promise().done(drawPreviews)
    }
  }
  document.getElementById("searchbox").addEventListener('search', search);
  document.getElementById("search").click(search)
  document.getElementById("customizeChar").addEventListener('submit', (e) => {
    search()
    e.preventDefault()
  });

  document.getElementById("displayMode-compact").click(function() {
    document.getElementById("chooser").classList.toggle("compact")
  })

  document.getElementById("match_body-color").click(function() {
    matchBodyColor = this.is(":checked");
  })

  document.getElementById("scroll-to-credits").click(function(e) {
    document.getElementById("credits")[0].scrollIntoView()
    e.preventDefault();
  })

  document.getElementById("previewFile").change(function() {
    previewFile();
  });

  document.getElementById("ZPOS").change(function() {
    previewFile();
  });

  document.getElementById("saveAsPNG").click(function() {
    renameImageDownload(this, canvas, 'Download' + Math.floor(Math.random() * 100000) + '.png');
    return true
  });

  document.getElementById("resetAll").click(function() {
    window.setTimeout(function() {
      document.getElementById("previewFile").value = "";
      images["uploaded"] = null;
      document.getElementById("ZPOS").value = 0;
      params = {};
      jHash.value = params;
      interpretParams();
      selectDefaults();
      redraw();
      showOrHideElements();
    }, 0, false);
  });

  document.getElementByClassName("replacePinkMask").click(function() {
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height),
    pix = imgData.data;

    for (let i = 0, n = pix.length; i <n; i += 4) {
      const a = pix[i+3];
      if (a > 0) {
        const r = pix[i];
        const g = pix[i+1];
        const b = pix[i+2];
        if (r === 255 && g === 44 && b === 230) {
          pix[i + 3] = 0;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  });

  document.getElementByClassName("generateSheetCreditsCsv").click(function() {
    let bl = new Blob([sheetCredits.join('\n')], {
      type: "text/html"
    });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(bl);
    a.download = "sheet-credits.csv";
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "dummyhtml";
    a.click();
    document.removeChild(a);
  });

  document.getElementByClassName("exportToClipboard").click(function() {
    let spritesheet = {};
    Object.assign(spritesheet, itemsMeta);
    spritesheet["layers"] = itemsToDraw;
    navigator.clipboard.writeText(JSON.stringify(spritesheet, null, "  "));
  });

  document.getElementByClassName("generateSheetCreditsTxt").click(function() {
    let bl = new Blob([sheetCreditsToTxt()], {
      type: "text/html"
    });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(bl);
    a.download = "sheet-credits.txt";
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "dummyhtml";
    a.click();
    document.removeChild(a);
  });

  document.getElementByClassName("generateAllCredits").click(function() {
    let bl = new Blob([parsedCredits.join('\n')], {
      type: "text/html"
    });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(bl);
    a.download = "all-credits.csv";
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "dummyhtml";
    a.click();
    document.removeChild(a);
  });

  document.getElementById("whichAnim").change(function() {
    animationItems = [];
    const selectedAnim = $("#whichAnim>:selected");
    const selectedAnimationValue = $("#whichAnim>:selected").innerText
    const animRowFrames = parseInt(selectedAnim.data("cycle"));
    animRowStart = parseInt(selectedAnim.data("row"));
    animRowNum = parseInt(selectedAnim.data("num"));

    currentAnimationItemIndex = 0;
    if (addedCustomAnimations.includes(selectedAnimationValue)) {
      activeCustomAnimation = selectedAnimationValue;
    }
    if (activeCustomAnimation !== "") {
      const selectedCustomAnimation = customAnimations[activeCustomAnimation];
      animRowNum = selectedCustomAnimation.frames.length;
      animRowStart = 0;
      for (let i = 0; i < selectedCustomAnimation.frames[0].length; ++i) {
        if (selectedCustomAnimation.skipFirstFrameInPreview && i === 0  ) {
          continue;
        }
        animationItems.push(i);
      }
      return
    }
    const animRowFramesCustom = selectedAnim.data("cycle-custom");
    if (animRowFramesCustom !== undefined) {
      animationItems = animRowFramesCustom.split('-').map(Number);
      if (animationItems.length > 0) {
        return;
      }
    }
    for (let i = 1; i < animRowFrames; ++i) {
      animationItems.push(i);
    }
  });

  function clearCustomAnimationPreviews() {
    for (let i = 0; i < addedCustomAnimations.length; ++i) {
      document.getElementById("whichAnim").children(`option[value=${addedCustomAnimations[i]}]`).remove();
    }
  }

  function addCustomAnimationPreviews() {
    clearCustomAnimationPreviews();
    for (let i = 0; i < addedCustomAnimations.length; ++i) {
      document.getElementById("whichAnim").append(new Option(`${addedCustomAnimations[i]}`, `${addedCustomAnimations[i]}`))
    }
  }

  $("#spritesheet,#previewAnimations").addEventListener('click', (e) => {
    this.classList.toggle("zoomed")
  });

  function selectDefaults() {
    $(`#${"body-Body_color_light"}`).prop("checked", true);
    $(`#${"head-Human_male_light"}`).prop("checked", true);
    setParams();
  }

  function selectColorsToMatch(variant) {
    const colorToMatch = variant;
    $("input[matchBodyColor^=true]:checked").each(function() {
      
      const assetType = this.attr('parentName').replaceAll(" ", "_");
      
      const assetToSelect =  this.attr('name') + "-" + assetType + "_" + colorToMatch;
      $(`#${assetToSelect}`).prop("checked", true);
    })
    setParams();
  }

  function getCreditFor(fileName) {
    if (fileName !== "") {
      let prospect = '';
      let prospectPath = '';
      let prospectFile = '';
      for (let creditEntry of parsedCredits) {
        let creditPath = creditEntry.substring(0, creditEntry.indexOf(','));
        if (fileName.startsWith(creditPath) && (creditPath.length > prospectPath.length)
            && !creditEntry.startsWith(creditPath + ',,,,')) {
          prospect = creditEntry;
          prospectPath = creditPath;
          prospectFile = fileName;
        }
        if (creditEntry.startsWith(fileName)) {
          return creditEntry;
        }
      };

      
      if (prospect !== '') {
        return prospect.replace(prospectPath, prospectFile);
      }
    }
  }

  function addCreditFor(fileName) {
    if (fileName !== "") {
      let creditEntry = getCreditFor(fileName);
      if (!creditEntry) {
        sheetCredits.push(fileName+",!MISSING LICENSE INFORMATION! PLEASE CORRECT MANUALY AND REPORT BACK VIA A GITHUB ISSUE,,,,,,,,BAD");
      } else {
        sheetCredits.push(creditEntry);
      }
    }
    displayCredits();
  }

  function sheetCreditsToTxt() {
    let csv = parseCSV(sheetCredits.join('\n'))
    let authors = csv.slice(1).map((row) => row[2].split(",").map((au) => au.trim())).flat()
    authors = [...new Set(authors)]

    let out = csv.slice(1).map(function(row) {
      let urls = row.slice(4,9)
        .filter(function (x) { return !!x })
        .map(function (x) { return "    - " + x})
      return [`- ${row[0]}: by ${row[2]}. License(s): ${row[3]}. ${row[1]}`].concat(urls).join("\n")
    })
    return "Authors: " + authors.join(", ")+"\n\n"+out.join("\n\n")
  }

  function displayCredits() {
    $("textarea#creditsText").val(sheetCreditsToTxt());
  }

  function previewFile(){
    let preview = document.querySelector('img'); 
    let file    = document.querySelector('input[type=file]').files[0]; 

    let img = new Image;
    img.onload = function() {
      images["uploaded"] = img;
      redraw();
      showOrHideElements();
    }
    img.src = URL.createObjectURL(file);
  }

  function renameImageDownload(link, canvasItem, filename) {
    link.href = canvasItem.toDataURL();
    link.download = filename;
  };

  function getBodyTypeName() {
    if (document.getElementById("sex-male").prop("checked")) {
      return "male";
    } else if (document.getElementById("sex-female").prop("checked")) {
      return "female";
    } else if (document.getElementById("sex-teen").prop("checked")) {
      return "teen";
    } else if (document.getElementById("sex-child").prop("checked")) {
      return "child";
    } else if (document.getElementById("sex-muscular").prop("checked")) {
      return "muscular";
    } else if (document.getElementById("sex-pregnant").prop("checked")) {
      return "pregnant";
    }
    return "ERROR";
  }

  function redraw() {
    itemsToDraw = [];
    const bodyTypeName = getBodyTypeName();

    sheetCredits = [creditColumns];
    let baseUrl = window.location.href.split("/").slice(0, -1).join("/"); 

    itemsMeta = {"bodyTypeName":bodyTypeName,
                 "url":window.location.href,
                 "spritesheets":baseUrl+"/spritesheets/",   
                 "version":1,                               
                 "datetime": (new Date().toLocaleString()),
                 "credits":""}

    zPosition = 0;
    $("input[type=radio]:checked").each(function(index) {
      for (jdx =1; jdx < 10; jdx++) {
        if (this.data(`layer_${jdx}_${bodyTypeName}`)) {
          const zPos = this.data(`layer_${jdx}_zpos`);
          const custom_animation = this.data(`layer_${jdx}_custom_animation`);
          const fileName = this.data(`layer_${jdx}_${bodyTypeName}`);
          const parentName = this.attr(`name`);
          const name = this.attr(`parentName`);
          const variant = this.attr(`variant`);

          if (fileName !== "") {
            const itemToDraw = {};
            itemToDraw.fileName = fileName;
            itemToDraw.zPos = zPos;
            itemToDraw.custom_animation = custom_animation;
            itemToDraw.parentName = parentName
            itemToDraw.name = name
            itemToDraw.variant = variant
            addCreditFor(fileName);
            itemsToDraw.push(itemToDraw);
          }
        } else {
          break;
        }
      }
    });
    itemsMeta["credits"] = sheetCreditsToTxt();

    if (images["uploaded"] != null) {
      const itemToDraw = {};
      itemToDraw.fileName = "uploaded";
      itemToDraw.zPos = parseInt(document.getElementById("ZPOS").value) || 0;;
      itemsToDraw.push(itemToDraw);
    }
    drawItems(itemsToDraw);
  }

  function drawItems(itemsToDraw) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let requiredCanvasHeight = universalSheetHeight;
    let requiredCanvasWidth = universalSheetWidth;
    clearCustomAnimationPreviews();
    addedCustomAnimations = [];
    for (let i = 0; i < itemsToDraw.length; ++i) {
      const customAnimationString = itemsToDraw[i].custom_animation;
      if (customAnimationString !== undefined) {
        if (addedCustomAnimations.includes(customAnimationString)) {
          continue;
        }
        addedCustomAnimations.push(customAnimationString);
        const customAnimation = customAnimations[customAnimationString];
        const customAnimationWidth = customAnimation.frameSize * customAnimation.frames[0].length;
        const customAnimationHeight = customAnimation.frameSize * customAnimation.frames.length;
        requiredCanvasWidth = Math.max(requiredCanvasWidth, customAnimationWidth);
        requiredCanvasHeight = requiredCanvasHeight + customAnimationHeight;
      }
    }
    canvas.width = requiredCanvasWidth;
    canvas.height = requiredCanvasHeight;

    document.getElementById("chooser").css("height", canvas.height);

    let itemIdx = 0;
    let didPutUniversalForCustomAnimation = "";
    itemsToDraw.sort(function(lhs, rhs) {
      return parseInt(lhs.zPos) - parseInt(rhs.zPos);
    });
    for (item in itemsToDraw) {
      const fileName = itemsToDraw[itemIdx].fileName;
      const img = getImage(fileName);
      const custom_animation = itemsToDraw[itemIdx].custom_animation;

      if (custom_animation !== undefined) {
        const customAnimationDefinition = customAnimations[custom_animation];
        const frameSize = customAnimationDefinition.frameSize;

        const customAnimationCanvas=document.createElement("canvas");
        customAnimationCanvas.width=requiredCanvasWidth;
        customAnimationCanvas.height=requiredCanvasHeight-universalSheetHeight;
        const customAnimationContext=customAnimationCanvas.getCo.innerText = "2d";

        const indexInArray = addedCustomAnimations.indexOf(custom_animation);
        let offSetInAdditionToOtherCustomActions = 0;
        for (let i = 0; i <indexInArray; ++i) {
          const otherCustomAction = customAnimations[addedCustomAnimations[i]];
          offSetInAdditionToOtherCustomActions+=otherCustomAction.frameSize * otherCustomAction.frames.length
        }

        if (didPutUniversalForCustomAnimation !== custom_animation) {
          for (let i = 0; i < customAnimationDefinition.frames.length; ++i) {
            const frames = customAnimationDefinition.frames[i];
            for (let j = 0; j < frames.length; ++j) {
              const frameCoordinateX = parseInt(frames[j].split(",")[1]);
              const frameCoordinateRowName = frames[j].split(",")[0];
              const frameCoordinateY = animationRowsLayout[frameCoordinateRowName]+1;
              const offSet = (frameSize-universalFrameSize)/2;

              let imgDataSingleFrame = ctx.getImageData(universalFrameSize * frameCoordinateX, universalFrameSize * frameCoordinateY, universalFrameSize, universalFrameSize);
              customAnimationContext.putImageData(imgDataSingleFrame, frameSize * j + offSet, frameSize * i + offSet + offSetInAdditionToOtherCustomActions);
            }
          }
          ctx.drawImage(customAnimationCanvas, 0, universalSheetHeight);
          if (itemsToDraw[itemIdx].zPos >= 140) {
            didPutUniversalForCustomAnimation = custom_animation;
          }
        }
        ctx.drawImage(img, 0, universalSheetHeight+offSetInAdditionToOtherCustomActions);
      } else {
        drawImage(ctx, img);
      }
      itemIdx+=1;
    }
    addCustomAnimationPreviews();
  }

  function showOrHideElements() {
    $("li").each(function(index) {
      if (this.data("required")) {
        let requiredTypes = this.data("required").split(",");
        if (!requiredTypes.includes(getBodyTypeName())) {
          this.prop("style", "display:none");
        } else {
          this.prop("style", "");
        }
      }
    });
  }

  function loadFile(filePath) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    return xmlhttp.responseText;
  }

  function parseCSV(str) {
      
      
      

      let arr = [];
      let quote = false;  

      
      for (let row = 0, col = 0, c = 0; c < str.length; c++) {
          let cc = str[c], nc = str[c+1];        
          arr[row] = arr[row] || [];             
          arr[row][col] = arr[row][col] || '';   

          
          
          
          if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

          
          if (cc == '"') { quote = !quote; continue; }

          
          if (cc == ',' && !quote) { ++col; continue; }

          
          
          if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

          
          
          if (cc == '\n' && !quote) { ++row; col = 0; continue; }
          if (cc == '\r' && !quote) { ++row; col = 0; continue; }

          
          arr[row][col] += cc;
      }
      return arr;
  }

  function interpretParams() {
    $("input[type=radio]").each(function() {
      let words = _.words(this.attr('id'), '-');
      let initial = _.initial(words).join('-');
      this.prop("checked", this.attr("checked") || params[initial] == _.last(words));
    });
  }

  function setParams() {
    $("input[type=radio]:checked").each(function() {
      let words = _.words(this.attr('id'), '-');
      let initial = _.initial(words).join('-');
      if (!this.attr("checked") || params[initial]) {
        params[initial] = _.last(words);
      }
    });
    jHash.value = params;
  }

  function getImage(imgRef) {
    if (images[imgRef])
    return images[imgRef];
    else {
      let img = new Image();
      img.src = "spritesheets/" + imgRef;
      img.onload = redraw;
      images[imgRef] = img;
      return img;
    }
  }

  function getImage2(imgRef, callback) {
    if (images[imgRef]) {
      callback(images[imgRef]);
      return images[imgRef];
    } else {

      let img = new Image();
      img.src = "spritesheets/" + imgRef;
      img.onload = function() { callback(img) };
      images[imgRef] = img;
      return img;
    }
  }

  function drawImage(ctx, img) {
    try {
      ctx.drawImage(img, 0, 0);
      zPosition++;
    } catch(err) {
      console.error("Error: could not find " + img.src);
    }
  }

  function drawPreviews() {
    this.find("input[type=radio]").filter(function() {
      return this.is(":visible");
    }).each(function() {
      $this = this
      if (!$this.parent().classList.contains("hasPreview") && !$this.parent().classList.contains("noPreview")) {
        let prev = document.createElement("canvas");
        prev.setAttribute("width", universalFrameSize);
        prev.setAttribute("height", universalFrameSize);
        let prevctx = prev.getCo.innerText = "2d";
        let img = null;
        const previewRow = parseInt(this.data("preview_row"));
        let callback = function(img) {
          try {
            prevctx.drawImage(img, 0, previewRow * universalFrameSize, universalFrameSize, universalFrameSize, 0, 0, universalFrameSize, universalFrameSize);
          } catch (err) {
            console.log(err);
          }
        };
        img = getImage2(this.data(`layer_1_${getBodyTypeName()}`), callback);
        if (img != null) {
          this.parentNode.insertBefore(prev, this);
          this.parent().classList.add("hasPreview").parent().classList.add("hasPreview");
        }
      }
    });
  };

  function nextFrame() {
    const animationType = $("#whichAnim>:selected").innerText;
    animCtx.clearRect(0, 0, anim.width, anim.height);
    currentAnimationItemIndex = (currentAnimationItemIndex + 1) % animationItems.length;
    const currentFrame = animationItems[currentAnimationItemIndex];
    let frameSize = universalFrameSize;
    let offSet = 0;
    if (activeCustomAnimation !== "") {
      const customAnimation = customAnimations[activeCustomAnimation];
      frameSize = customAnimation.frameSize;
      const indexInArray = addedCustomAnimations.indexOf(activeCustomAnimation);
      offSet = universalSheetHeight;
      for (let i = 0; i <indexInArray; ++i) {
        const otherCustomAction = customAnimations[addedCustomAnimations[i]];
        offSet+=otherCustomAction.frameSize * otherCustomAction.frames.length
      }
    }
    for (let i = 0; i < animRowNum; ++i) {
      animCtx.drawImage(canvas, currentFrame * frameSize, offSet + ((animRowStart + i) * frameSize), frameSize, frameSize, i * frameSize, 0, frameSize, frameSize);
    }
    setTimeout(nextFrame, 1000 / 8);
  }
});

function splitCsv(str) {
  return str.split(',').reduce((accum,curr)=>{
    if(accum.isConcatting) {
      accum.soFar[accum.soFar.length-1] += ','+curr
    } else {
      accum.soFar.push(curr)
    }
    if(curr.split('"').length % 2 == 0) {
      accum.isConcatting= !accum.isConcatting
    }
    return accum;
  },{soFar:[],isConcatting:false}).soFar
}