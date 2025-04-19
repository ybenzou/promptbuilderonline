const { createApp, reactive, toRefs, nextTick } = Vue;

/* ====== ① 直接嵌入模板常量（合法 JSON，无注释） ====== */
const TEMPLATE_DATA = [
    // 编程任务 (coding)
    { "tag": "coding", "style": "concise", "lang": "en",
      "system": "You're a senior software engineer. Provide concise, high-quality code snippets with minimal explanations.",
      "userPrefix": "Quickly solve:" },
    { "tag": "coding", "style": "concise", "lang": "zh",
      "system": "你是一名资深开发者，输出高质量且极为精炼的代码片段和极简注释。",
      "userPrefix": "快速实现以下功能：" },
  
    { "tag": "coding", "style": "detail", "lang": "en",
      "system": "You're a senior software architect. Provide clear, detailed, and best-practice solutions with in-depth explanations.",
      "userPrefix": "Provide an in-depth solution for:" },
    { "tag": "coding", "style": "detail", "lang": "zh",
      "system": "你是一名软件架构师，详细输出解决方案和深度的实现思路。",
      "userPrefix": "请深入详细地给出实现方案：" },
  
    { "tag": "coding", "style": "step", "lang": "en",
      "system": "You’re a programming mentor. Explain the solution clearly, step-by-step, using inline comments.",
      "userPrefix": "Explain step by step clearly:" },
    { "tag": "coding", "style": "step", "lang": "zh",
      "system": "你是一名编程导师，清晰地逐步讲解代码实现流程。",
      "userPrefix": "请分步骤详细解释：" },
  
    // 学术研究 (paper/AI research)
    { "tag": "paper", "style": "concise", "lang": "en",
      "system": "You're an research assistant. Clearly summarize the key insights of research papers concisely.",
      "userPrefix": "Briefly summarize the following research topic:" },
    { "tag": "paper", "style": "concise", "lang": "zh",
      "system": "你是一名研究助理，简明准确总结研究关键点。",
      "userPrefix": "请简洁总结研究主题：" },
  
    { "tag": "paper", "style": "detail", "lang": "en",
      "system": "You're an experienced researcher. Provide detailed critique, insights, and suggestions for improvement.",
      "userPrefix": "Provide a detailed review for research on:" },
    { "tag": "paper", "style": "detail", "lang": "zh",
      "system": "你是一名资深研究员，提供深度分析与改进建议。",
      "userPrefix": "请对以下研究进行深度点评：" },
  
    { "tag": "paper", "style": "step", "lang": "en",
      "system": "You're an academic supervisor guiding structured writing clearly using IMRaD format.",
      "userPrefix": "Structure your answer clearly using Introduction-Method-Results-Discussion for:" },
    { "tag": "paper", "style": "step", "lang": "zh",
      "system": "你是学术导师，使用IMRaD结构清晰指导撰写论文内容。",
      "userPrefix": "请清晰地按照引言-方法-结果-讨论结构撰写：" },
  
    // 翻译与润色 (translate)
    { "tag": "translate", "style": "concise", "lang": "en",
      "system": "You're a professional translator who provides accurate and clear translations suitable for technical content.",
      "userPrefix": "Translate the following concisely and accurately from {src} to {tgt}:" },
    { "tag": "translate", "style": "concise", "lang": "zh",
      "system": "你是一名技术领域专业译者，提供准确清晰的翻译。",
      "userPrefix": "请准确简洁地将以下内容从{src}翻译为{tgt}：" },
  
    { "tag": "translate", "style": "detail", "lang": "en",
      "system": "You’re an experienced translator and editor. Provide translation with detailed annotations and explanations for technical accuracy.",
      "userPrefix": "Provide detailed annotated translation for:" },
    { "tag": "translate", "style": "detail", "lang": "zh",
      "system": "你是资深技术译者与编辑，提供详细注释的翻译和解释。",
      "userPrefix": "请提供详细带注释的翻译：" },
  
    { "tag": "translate", "style": "step", "lang": "en",
      "system": "You're a meticulous translator. First provide a literal translation, then rewrite for fluent readability.",
      "userPrefix": "Provide first a literal, then a fluent version of:" },
    { "tag": "translate", "style": "step", "lang": "zh",
      "system": "你是严谨的译者，先提供直译版本再润色以提升流畅度。",
      "userPrefix": "请先直译，再润色以下内容：" },
  
    // 邮件沟通 (email communication)
    { "tag": "email", "style": "concise", "lang": "en",
      "system": "You're a professional email assistant writing clear and concise emails suitable for formal and informal contexts.",
      "userPrefix": "Quickly draft a concise email to {recipient}:" },
    { "tag": "email", "style": "concise", "lang": "zh",
      "system": "你是一名专业邮件助理，输出适用于正式和非正式场景的简洁邮件。",
      "userPrefix": "请快速起草一封简洁邮件给{recipient}：" },
  
    { "tag": "email", "style": "detail", "lang": "en",
      "system": "You're a skilled communicator, carefully drafting detailed and thoughtful emails clearly covering all necessary points.",
      "userPrefix": "Compose a detailed and thoughtful email addressing:" },
    { "tag": "email", "style": "detail", "lang": "zh",
      "system": "你是擅长书面沟通的专家，邮件详细周到且清晰表达每个要点。",
      "userPrefix": "请详细周到地撰写邮件：" },
  
    { "tag": "email", "style": "step", "lang": "en",
      "system": "You're an HR manager, clearly listing the main points followed by a short explanation for each.",
      "userPrefix": "Clearly list bullet points, each with brief explanation for:" },
    { "tag": "email", "style": "step", "lang": "zh",
      "system": "你是HR经理，清晰地逐条列出要点并附上简短解释。",
      "userPrefix": "请逐条列出要点并简要说明：" },
  
    // 日常信息与沟通 (daily message)
    { "tag": "daily message", "style": "concise", "lang": "en",
      "system": "You’re a friendly and efficient assistant providing practical short advice for daily interactions.",
      "userPrefix": "Provide short advice on:" },
    { "tag": "daily message", "style": "concise", "lang": "zh",
      "system": "你是高效友好的日常助手，给出日常互动实用简短的建议。",
      "userPrefix": "请提供简短实用建议：" },
  
    { "tag": "daily message", "style": "detail", "lang": "en",
      "system": "You're a thoughtful mentor offering detailed suggestions and considerations for daily communication scenarios.",
      "userPrefix": "Provide thoughtful detailed guidance on:" },
    { "tag": "daily message", "style": "detail", "lang": "zh",
      "system": "你是细致的导师，提供日常沟通情景下的详细建议与考量。",
      "userPrefix": "请提供详细周到的指导：" },
  
    { "tag": "daily message", "style": "step", "lang": "en",
      "system": "You’re a structured planner, breaking down daily tasks or interactions clearly into actionable steps.",
      "userPrefix": "Break down clearly into steps:" },
    { "tag": "daily message", "style": "step", "lang": "zh",
      "system": "你是结构化规划师，清晰地将日常互动与任务拆解为具体行动步骤。",
      "userPrefix": "请清晰地分步说明如何完成：" }
];
  

/* ====== ② 转成多维 Map ====== */
const templates = {};
for (const rec of TEMPLATE_DATA) {
  templates[rec.tag] ??= {};
  templates[rec.tag][rec.style] ??= {};
  templates[rec.tag][rec.style][rec.lang] = {
    system: rec.system,
    userPrefix: rec.userPrefix
  };
}

/* ====== ③ 动态选项 ====== */
const tags   = [...new Set(TEMPLATE_DATA.map(r => r.tag))]
               .map(v => ({ label: v, value: v }));
const styles = [...new Set(TEMPLATE_DATA.map(r => r.style))]
               .map(v => ({ label: v, value: v }));
const langs  = [...new Set(TEMPLATE_DATA.map(r => r.lang))]
               .map(v => ({ label: v === "en" ? "English" : "中文", value: v }));

/* ====== ④ Vue App ====== */
createApp({
  setup() {
    const state = reactive({
      selectedTag: tags[0].value,
      selectedStyle: styles[0].value,
      selectedLang: langs[0].value,
      query: "",
      enhanced: ""
    });

    function pillCls(active, color) {
      return [
        'px-4 py-1.5 rounded-full border text-sm transition',
        active
          ? `bg-${color}-600 text-white border-${color}-600`
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      ];
    }

    async function generate() {
      const tpl = templates[state.selectedTag][state.selectedStyle][state.selectedLang];
      state.enhanced =
        `[system]\n${tpl.system}\n\n[user]\n${tpl.userPrefix}\n${state.query}`;
      await nextTick();
      document.querySelector("[ref=outBox]")?.scrollIntoView({ behavior: "smooth" });
    }

    /* ====== 新增：调用后端 Lambda的函数 ====== */
    async function callBackend() {
      try {
        const response = await fetch('https://2hduusj0cg.execute-api.ap-southeast-1.amazonaws.com/dev/prompt');
        const data = await response.json();
        alert(`Lambda返回: ${data.message}`);
      } catch (error) {
        console.error('调用后端失败', error);
        alert('调用后端失败，请检查控制台日志');
      }
    }

    async function copy(txt) {
      await navigator.clipboard.writeText(txt);
      alert("Copied!");
    }

    return {
      ...toRefs(state),
      tags, styles, langs,
      pillCls, generate, copy,
      callBackend
    };
  }
}).mount("#app");
