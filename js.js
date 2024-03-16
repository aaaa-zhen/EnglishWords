
function displayContent(content) {
    const translationResult = document.getElementById('translationResult');

    // 添加实际内容
    translationResult.textContent = content;
    // 将透明度设置为1，以触发平滑过渡效果
    translationResult.style.opacity = 1;
  }

document.addEventListener('DOMContentLoaded', function() {
    var input = document.getElementById('wordInput');
    var underline = document.getElementById('underline');
    var generateDefinitionButton = document.getElementById('generatedefinton'); // 获取定义生成按钮
    var generateSentenceButton = document.getElementById('generatesenten'); // 获取句子生成按钮

    function updateUnderline() {
        var textWidth = getTextWidth(input.value, getComputedStyle(input).fontSize + " " + getComputedStyle(input).fontFamily);
        underline.style.width = textWidth + 'px';
    }

    function getTextWidth(text, font) {
        var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        return context.measureText(text).width;
    }

    input.addEventListener('input', updateUnderline);
    updateUnderline(); // 初始时也更新一次下划线宽度

    // 监听回车键的按下事件
    input.addEventListener('keydown', function(event) {
        if (event.key === "Enter") { // 检查是否为回车键
            event.preventDefault(); // 防止默认行为，如表单提交

            // 先触发定义生成按钮的点击事件
            if (generateDefinitionButton) {
                generateDefinitionButton.click();
            }

            // 然后触发句子生成按钮的点击事件
            if (generateSentenceButton) {
                generateSentenceButton.click();
            }
        }
    });
});

document.getElementById('playSoundIcon').addEventListener('click', function() {
    var textToSpeak = document.getElementById('wordInput').value;

    // 如果文本框为空，则不执行任何操作
    if (!textToSpeak.trim()) return;

    fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sess-H0sw5dSyfZ3AzFn5VedMOLvQugXmdIsvAKbtEq5l' // 这里替换成你的API密钥
        },
        body: JSON.stringify({
            model: "tts-1-hd",
            input: textToSpeak,
            voice: "echo"
        })
    })
    .then(response => response.blob())
    .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var audioElement = document.getElementById('audioResult');
        audioElement.src = url;
        audioElement.play(); // 播放生成的音频
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
// 封装了一个用于API请求的通用函数
async function fetchFromAPI(endpoint, body) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 注意：不要在客户端代码中硬编码API密钥！
                'Authorization': 'Bearer sk-702YJEAotdxlkxgR603cF6799f4440D6A7FdCcD29eFa4d17'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error; // 将错误向上抛出，以便调用者处理
    }
}

// Generate Definition
document.getElementById('generatedefinton').addEventListener('click', async function() {
    const textToTranslate = document.getElementById('wordInput').value;
    const body = {
        model: "gpt-4",
        messages: [
            {"role": "system", "content": "Explain this word simply and shortly for a 10-year-old."},
            {"role": "user", "content": textToTranslate}
        ],
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1
    };
    
    try {
        const data = await fetchFromAPI('https://aihubmix.com/v1/chat/completions', body);
        displayResult(data, 'translationResult', textToTranslate);
    } catch (error) {
        // 错误已经在fetchFromAPI中打印，这里可以进行用户提示或其他错误处理
    }
});

// Generate Sentence
document.getElementById('generatesenten').addEventListener('click', async function() {
    const textToTranslate = document.getElementById('wordInput').value;
    const body = {
        model: "gpt-4",
        messages: [
            {"role": "system", "content": "Create a sentence using this word. The sentence should be humorous and funny, and not too long"},
            {"role": "user", "content": textToTranslate}
        ],
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1
    };
    
    try {
        const data = await fetchFromAPI('https://aihubmix.com/v1/chat/completions', body);
        displayResult(data, 'sentenceResult', textToTranslate);
    } catch (error) {
        // 错误处理
    }
});

// 用于显示结果的函数，避免重复代码
function displayResult(data, elementId, textToTranslate) {
    const element = document.getElementById(elementId);
    element.textContent = data.choices[0].message.content;
    let highlightedText = data.choices[0].message.content.replace(new RegExp(textToTranslate, "gi"), `<span style="color: red;">$&</span>`);
    element.innerHTML = highlightedText; 
    element.style.opacity = 1; // 触发动画
}






  



  
