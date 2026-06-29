import React, { useState } from 'react';
import { Icon } from '@iconify/react';

type Framework = 'html' | 'react' | 'vue' | 'svelte';

export const NotebookGuide: React.FC = () => {
  const [framework, setFramework] = useState<Framework>('html');

  // Node.js Backend provisioning code (always displayed at the top)
  const renderBackendCode = () => {
    return (
      <div className="flex-grow bg-slate-50 border border-slate-200 rounded p-4 font-mono text-sm overflow-x-auto">
        <div>
          <span className="text-purple-600 font-semibold">const</span> axios = <span className="text-blue-600">require</span>(<span className="text-emerald-600">'axios'</span>);
        </div>
        <div className="text-slate-400 mt-1">// Cấu hình thông tin gọi API</div>
        <div>
          <span className="text-purple-600 font-semibold">const</span> VBOT_API_URL = <span className="text-emerald-600">'https://open-api.vbot.vn/v3.0/api/sdk/tokenSdk'</span>;
        </div>
        <div>
          <span className="text-purple-600 font-semibold">const</span> PARTNER_API_KEY = <span className="text-emerald-600">'your_partner_api_key_here'</span>;
        </div>
        <div className="mt-2">
          <span className="text-purple-600 font-semibold">async function</span> <span className="text-blue-700">getSdkToken</span>(memberNo, hotlines) &#123;
        </div>
        <div className="pl-4">
          <span className="text-purple-600 font-semibold">try</span> &#123;
        </div>
        <div className="pl-8">
          <span className="text-purple-600 font-semibold">const</span> response = <span className="text-purple-600 font-semibold">await</span> axios.<span className="text-blue-700">post</span>(VBOT_API_URL, &#123;
        </div>
        <div className="pl-12">
          member_no: memberNo,
        </div>
        <div className="pl-12">
          hotline_codes: hotlines <span className="text-slate-400">// ví dụ: ['hotline_1', 'hotline_2']</span>
        </div>
        <div className="pl-8">&#125;, &#123;</div>
        <div className="pl-12">
          headers: &#123;
            <span className="text-emerald-600">'Authorization'</span>: <span className="text-emerald-600">`Bearer $&#123;PARTNER_API_KEY&#125;`</span>,
            <span className="text-emerald-600">'Content-Type'</span>: <span className="text-emerald-600">'application/json'</span>
          &#125;
        </div>
        <div className="pl-8">&#125;);</div>
        <div className="pl-8 mt-2">
          <span className="text-purple-600 font-semibold">if</span> (response.data.error === <span className="text-amber-600">0</span>) &#123;
        </div>
        <div className="pl-12">
          <span className="text-purple-600 font-semibold">return</span> response.data.data; <span className="text-slate-400">// JWT SDK Token</span>
        </div>
        <div className="pl-8">&#125; <span className="text-purple-600 font-semibold">else</span> &#123;</div>
        <div className="pl-12">
          <span className="text-purple-600 font-semibold">throw new</span> <span className="text-blue-600">Error</span>(response.data.message);
        </div>
        <div className="pl-8">&#125;</div>
        <div className="pl-4">&#125; <span className="text-purple-600 font-semibold">catch</span> (error) &#123;</div>
        <div className="pl-8">
          console.<span className="text-blue-700">error</span>(<span className="text-emerald-600">'Lỗi lấy token:'</span>, error.message);
        </div>
        <div className="pl-4">&#125;</div>
        <div>&#125;</div>
      </div>
    );
  };

  // Render Front-End Integration Code based on selected framework
  const renderFrontendCode = () => {
    switch (framework) {
      case 'html':
        return (
          <div className="flex-grow bg-slate-50 border border-slate-200 rounded p-4 font-mono text-sm overflow-x-auto">
            <div><span className="text-slate-400">&lt;!-- 1. Nhập thư viện qua CDN --&gt;</span></div>
            <div>
              <span className="text-blue-800">&lt;script</span> <span className="text-orange-600">src</span>=<span className="text-emerald-600">"https://cdn.vbot.vn/vbot-sdk/vbot-sdk.umd.js"</span> <span className="text-orange-600">defer</span><span className="text-blue-800">&gt;&lt;/script&gt;</span>
            </div>
            
            <div className="mt-4"><span className="text-slate-400">&lt;!-- 2. Khai báo thẻ Custom Element --&gt;</span></div>
            <div>
              <span className="text-blue-800">&lt;vbot-widget</span> 
              <span className="text-orange-600"> token</span>=<span className="text-emerald-600">"JWT_TOKEN_FROM_STEP_1"</span>
              <span className="text-orange-600"> disconnect-sound-url</span>=<span className="text-emerald-600">"https://your-domain.com/sound.webm"</span>
              <span className="text-blue-800">&gt;&lt;/vbot-widget&gt;</span>
            </div>
          </div>
        );
      
      case 'react':
        return (
          <div className="flex-grow bg-slate-50 border border-slate-200 rounded p-4 font-mono text-sm overflow-x-auto">
            <div><span className="text-slate-400">// 1. Khai báo Typings cho JSX (src/vite-env.d.ts)</span></div>
            <div><span className="text-purple-600 font-semibold">declare global</span> &#123;</div>
            <div className="pl-4"><span className="text-purple-600 font-semibold">namespace</span> JSX &#123;</div>
            <div className="pl-8"><span className="text-purple-600 font-semibold">interface</span> IntrinsicElements &#123;</div>
            <div className="pl-12">
              <span className="text-emerald-600">'vbot-widget'</span>: React.DetailedHTMLProps&lt;React.HTMLAttributes&lt;HTMLElement&gt;, HTMLElement&gt; &amp; &#123;
            </div>
            <div className="pl-16">token?: <span className="text-blue-600">string</span>;</div>
            <div className="pl-16">headless?: <span className="text-blue-600">string</span>;</div>
            <div className="pl-16">config?: <span className="text-blue-600">string</span>;</div>
            <div className="pl-16"><span className="text-emerald-600">'disconnect-sound-url'</span>?: <span className="text-blue-600">string</span>;</div>
            <div className="pl-16">ref?: React.RefObject&lt;<span className="text-blue-600">any</span>&gt;;</div>
            <div className="pl-12">&#125;;</div>
            <div className="pl-8">&#125;</div>
            <div className="pl-4">&#125;</div>
            <div>&#125;</div>

            <div className="mt-4"><span className="text-slate-400">// 2. Component sử dụng Widget</span></div>
            <div><span className="text-purple-600 font-semibold">import</span> React, &#123; useRef &#125; <span className="text-purple-600 font-semibold">from</span> <span className="text-emerald-600">'react'</span>;</div>
            <div className="mt-2">
              <span className="text-purple-600 font-semibold">export const</span> <span className="text-blue-700">PhoneWidget</span> = (&#123; token &#125;) =&gt; &#123;
            </div>
            <div className="pl-4">
              <span className="text-purple-600 font-semibold">const</span> widgetRef = useRef&lt;<span className="text-blue-600">any</span>&gt;(<span className="text-purple-600 font-semibold">null</span>);
            </div>
            <div className="pl-4 font-semibold text-purple-600 mt-1">
              return (
            </div>
            <div className="pl-8 text-blue-800">
              &lt;vbot-widget
            </div>
            <div className="pl-12">
              <span className="text-orange-600">ref</span>=&#123;widgetRef&#125;
            </div>
            <div className="pl-12">
              <span className="text-orange-600">token</span>=&#123;token&#125;
            </div>
            <div className="pl-12">
              <span className="text-orange-600">disconnect-sound-url</span>=<span className="text-emerald-600">"https://your-domain.com/sound.webm"</span>
            </div>
            <div className="pl-8 text-blue-800">
              /&gt;
            </div>
            <div className="pl-4 font-semibold text-purple-600">
              );
            </div>
            <div>&#125;;</div>
          </div>
        );
      
      case 'vue':
        return (
          <div className="flex-grow bg-slate-50 border border-slate-200 rounded p-4 font-mono text-sm overflow-x-auto">
            <div><span className="text-slate-400">// 1. Khai báo Custom Element để Vite/Vue Compiler không báo lỗi (vite.config.js)</span></div>
            <div><span className="text-purple-600 font-semibold">export default</span> <span className="text-blue-700">defineConfig</span>(&#123;</div>
            <div className="pl-4">plugins: [</div>
            <div className="pl-8"><span className="text-blue-700">vue</span>(&#123;</div>
            <div className="pl-12">template: &#123;</div>
            <div className="pl-16">compilerOptions: &#123;</div>
            <div className="pl-20">isCustomElement: (tag) =&gt; tag.<span className="text-blue-700">startsWith</span>(<span className="text-emerald-600">'vbot-'</span>)</div>
            <div className="pl-16">&#125;</div>
            <div className="pl-12">&#125;</div>
            <div className="pl-8">&#125;)</div>
            <div className="pl-4">]</div>
            <div>&#125;);</div>

            <div className="mt-4"><span className="text-slate-400">// 2. Single File Component (PhoneCall.vue)</span></div>
            <div><span className="text-blue-800">&lt;template&gt;</span></div>
            <div className="pl-4 text-blue-800">&lt;vbot-widget</div>
            <div className="pl-8">
              <span className="text-orange-600">ref</span>=<span className="text-emerald-600">"widgetRef"</span>
            </div>
            <div className="pl-8">
              <span className="text-orange-600">:token</span>=<span className="text-emerald-600">"token"</span>
            </div>
            <div className="pl-8">
              <span className="text-orange-600">disconnect-sound-url</span>=<span className="text-emerald-600">"https://your-domain.com/sound.webm"</span>
            </div>
            <div className="pl-4 text-blue-800">/&gt;</div>
            <div><span className="text-blue-800">&lt;/template&gt;</span></div>
            <div className="mt-2"><span className="text-blue-800">&lt;script</span> <span className="text-orange-600">setup</span><span className="text-blue-800">&gt;</span></div>
            <div><span className="text-purple-600 font-semibold">import</span> &#123; ref &#125; <span className="text-purple-600 font-semibold">from</span> <span className="text-emerald-600">'vue'</span>;</div>
            <div><span className="text-purple-600 font-semibold">defineProps</span>(&#123; token: String &#125;);</div>
            <div><span className="text-purple-600 font-semibold">const</span> widgetRef = <span className="text-blue-700">ref</span>(<span className="text-purple-600 font-semibold">null</span>);</div>
            <div><span className="text-blue-800">&lt;/script&gt;</span></div>
          </div>
        );

      case 'svelte':
        return (
          <div className="flex-grow bg-slate-50 border border-slate-200 rounded p-4 font-mono text-sm overflow-x-auto">
            <div><span className="text-slate-400">// Sử dụng trong Svelte Component (Svelte 4 & 5)</span></div>
            <div><span className="text-blue-800">&lt;script&gt;</span></div>
            <div className="pl-4"><span className="text-purple-600 font-semibold">export let</span> token = <span className="text-emerald-600">""</span>;</div>
            <div className="pl-4"><span className="text-purple-600 font-semibold">let</span> widgetEl;</div>
            <div><span className="text-blue-800">&lt;/script&gt;</span></div>
            
            <div className="mt-4"><span className="text-slate-400">&lt;!-- Svelte liên kết đối tượng DOM qua bind:this --&gt;</span></div>
            <div><span className="text-blue-800">&lt;vbot-widget</span></div>
            <div className="pl-4">
              <span className="text-orange-600">bind:this</span>=&#123;widgetEl&#125;
            </div>
            <div className="pl-4">
              <span className="text-orange-600">token</span>=&#123;token&#125;
            </div>
            <div className="pl-4">
              <span className="text-orange-600">disconnect-sound-url</span>=<span className="text-emerald-600">"https://your-domain.com/sound.webm"</span>
            </div>
            <div><span className="text-blue-800">&gt;&lt;/vbot-widget&gt;</span></div>
          </div>
        );
    }
  };

  // Render public interaction / event code based on framework
  const renderInteractionCode = () => {
    switch (framework) {
      case 'html':
        return (
          <div className="flex-grow bg-slate-50 border border-slate-200 rounded p-4 font-mono text-sm overflow-x-auto">
            <div><span className="text-purple-600 font-semibold">const</span> widget = document.<span className="text-blue-700">querySelector</span>(<span className="text-emerald-600">'vbot-widget'</span>);</div>
            <div className="text-slate-400 mt-2">// 1. Thực hiện cuộc gọi đi</div>
            <div>widget.<span className="text-blue-700">makeCall</span>(<span className="text-emerald-600">'0912345678'</span>, <span className="text-emerald-600">'hotline_main'</span>);</div>
            
            <div className="text-slate-400 mt-3">// 2. Lắng nghe cuộc gọi đến đổ chuông</div>
            <div>widget.<span className="text-blue-700">addEventListener</span>(<span className="text-emerald-600">'vbot:onCallIncoming'</span>, (event) =&gt; &#123;</div>
            <div className="pl-4">console.<span className="text-blue-700">log</span>(<span className="text-emerald-600">'Đang đổ chuông từ:'</span>, event.detail.phoneNumber);</div>
            <div>&#125;);</div>
          </div>
        );

      case 'react':
        return (
          <div className="flex-grow bg-slate-50 border border-slate-200 rounded p-4 font-mono text-sm overflow-x-auto">
            <div><span className="text-purple-600 font-semibold">import</span> &#123; useEffect &#125; <span className="text-purple-600 font-semibold">from</span> <span className="text-emerald-600">'react'</span>;</div>
            <div className="mt-2">
              <span className="text-slate-400">// Quản lý vòng đời sự kiện trong useEffect</span>
            </div>
            <div><span className="text-blue-700">useEffect</span>(() =&gt; &#123;</div>
            <div className="pl-4"><span className="text-purple-600 font-semibold">const</span> widget = widgetRef.current;</div>
            <div className="pl-4"><span className="text-purple-600 font-semibold">if</span> (!widget) <span className="text-purple-600 font-semibold">return</span>;</div>
            
            <div className="pl-4 mt-2"><span className="text-purple-600 font-semibold">const</span> <span className="text-blue-700">handleIncoming</span> = (e) =&gt; console.<span className="text-blue-700">log</span>(e.detail.phoneNumber);</div>
            <div className="pl-4">widget.<span className="text-blue-700">addEventListener</span>(<span className="text-emerald-600">'vbot:onCallIncoming'</span>, handleIncoming);</div>
            
            <div className="pl-4 mt-2"><span className="text-purple-600 font-semibold">return</span> () =&gt; &#123;</div>
            <div className="pl-8">widget.<span className="text-blue-700">removeEventListener</span>(<span className="text-emerald-600">'vbot:onCallIncoming'</span>, handleIncoming);</div>
            <div className="pl-4">&#125;;</div>
            <div>&#125;, []);</div>
            
            <div className="text-slate-400 mt-3">// Gọi đi</div>
            <div><span className="text-purple-600 font-semibold">const</span> <span className="text-blue-700">handleCall</span> = () =&gt; widgetRef.current?.<span className="text-blue-700">makeCall</span>(<span className="text-emerald-600">'0912345678'</span>);</div>
          </div>
        );

      case 'vue':
        return (
          <div className="flex-grow bg-slate-50 border border-slate-200 rounded p-4 font-mono text-sm overflow-x-auto">
            <div><span className="text-purple-600 font-semibold">import</span> &#123; onMounted, onUnmounted &#125; <span className="text-purple-600 font-semibold">from</span> <span className="text-emerald-600">'vue'</span>;</div>
            <div className="mt-2">
              <span className="text-purple-600 font-semibold">const</span> <span className="text-blue-700">handleIncoming</span> = (e) =&gt; console.<span className="text-blue-700">log</span>(e.detail.phoneNumber);
            </div>
            <div className="mt-2">
              <span className="text-blue-700">onMounted</span>(() =&gt; &#123;
            </div>
            <div className="pl-4">
              widgetRef.value?.<span className="text-blue-700">addEventListener</span>(<span className="text-emerald-600">'vbot:onCallIncoming'</span>, handleIncoming);
            </div>
            <div>&#125;);</div>
            <div className="mt-2">
              <span className="text-blue-700">onUnmounted</span>(() =&gt; &#123;
            </div>
            <div className="pl-4">
              widgetRef.value?.<span className="text-blue-700">removeEventListener</span>(<span className="text-emerald-600">'vbot:onCallIncoming'</span>, handleIncoming);
            </div>
            <div>&#125;);</div>
            <div className="text-slate-400 mt-3">// Gọi đi</div>
            <div><span className="text-purple-600 font-semibold">const</span> <span className="text-blue-700">makeCall</span> = () =&gt; widgetRef.value?.<span className="text-blue-700">makeCall</span>(<span className="text-emerald-600">'0912345678'</span>);</div>
          </div>
        );

      case 'svelte':
        return (
          <div className="flex-grow bg-slate-50 border border-slate-200 rounded p-4 font-mono text-sm overflow-x-auto">
            <div><span className="text-purple-600 font-semibold">import</span> &#123; onMount &#125; <span className="text-purple-600 font-semibold">from</span> <span className="text-emerald-600">'svelte'</span>;</div>
            <div className="mt-2">
              <span className="text-purple-600 font-semibold">const</span> <span className="text-blue-700">handleIncoming</span> = (e) =&gt; console.<span className="text-blue-700">log</span>(e.detail.phoneNumber);
            </div>
            <div className="mt-2">
              <span className="text-blue-700">onMount</span>(() =&gt; &#123;
            </div>
            <div className="pl-4">
              widgetEl.<span className="text-blue-700">addEventListener</span>(<span className="text-emerald-600">'vbot:onCallIncoming'</span>, handleIncoming);
            </div>
            <div className="pl-4"><span className="text-purple-600 font-semibold">return</span> () =&gt; &#123;</div>
            <div className="pl-8">
              widgetEl.<span className="text-blue-700">removeEventListener</span>(<span className="text-emerald-600">'vbot:onCallIncoming'</span>, handleIncoming);
            </div>
            <div className="pl-4">&#125;;</div>
            <div>&#125;);</div>
            <div className="text-slate-400 mt-3">// Gọi đi</div>
            <div><span className="text-purple-600 font-semibold">const</span> <span className="text-blue-700">makeCall</span> = () =&gt; widgetEl?.<span className="text-blue-700">makeCall</span>(<span className="text-emerald-600">'0912345678'</span>);</div>
          </div>
        );
    }
  };

  return (
    <div className="bg-[#f7f7f7] min-h-screen pb-16 font-sans text-slate-800 pt-8">
      {/* Main Notebook Container */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-sm rounded-xs py-8">
        
        {/* CELL 1: Markdown Cell */}
        <div className="flex py-2 px-6 group hover:bg-slate-50/50">
          <div className="w-16 flex-none text-right pr-4 font-mono text-xs text-slate-300 select-none pt-1" />
          <div className="flex-1 prose prose-slate max-w-none">
            <h1 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Hướng dẫn Tích hợp VBot Web SDK cho Đối tác
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tài liệu này trình bày chi tiết quy trình chuẩn để tích hợp <strong>VBot Web SDK</strong> vào hệ thống CRM/Website của đối tác. Quá trình tích hợp bao gồm việc xác thực an toàn từ phía Server (Backend) để sinh Token và nhúng Web Component <code>&lt;vbot-widget&gt;</code> phía Client (Frontend).
            </p>
          </div>
        </div>

        {/* CELL 2: Markdown Cell */}
        <div className="flex py-2 px-6 group hover:bg-slate-50/50 mt-6">
          <div className="w-16 flex-none text-right pr-4 font-mono text-xs text-slate-300 select-none pt-1" />
          <div className="flex-1 prose prose-slate max-w-none">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">1</span>
              Bước 1: Quy trình Backend chuẩn bị dữ liệu và cấp SDK Token
            </h2>
            
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              Để thành viên (nhân viên) có thể thực hiện cuộc gọi, phía máy chủ của bạn (Backend) cần tuân thủ quy trình sau trước khi truyền Token xuống Client:
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 my-3.5 rounded-r">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Icon icon="solar:danger-bold" className="text-amber-600 text-sm" />
                ⚠️ Điều kiện bắt buộc để gọi điện thành công:
              </h4>
              <ul className="list-disc pl-4 text-xs text-amber-900 flex flex-col gap-1">
                <li><strong>Phải gán Hotline</strong>: Nhân viên phải được gán ít nhất một hotline hoạt động.</li>
                <li><strong>Tài khoản phải có tiền</strong>: Tài khoản nhân viên phải có số dư lớn hơn 0đ (nạp tiền thông qua API <code>/api/member/addMoney</code>).</li>
              </ul>
            </div>

            <ol className="list-decimal pl-5 text-sm text-slate-650 flex flex-col gap-2.5 my-4">
              <li>
                <strong>Bước 1.1: Lấy SDK Token (Server-to-Server)</strong>:
                <p className="text-xs text-slate-500 mt-0.5">
                  Phía Backend gọi API <code>POST /api/sdk/tokenSdk</code> của VBot kèm theo <code>member_no</code> và danh sách <code>hotline_codes</code> để tạo/lấy JWT token cấp quyền cho SDK Client.
                </p>
                <div className="bg-sky-50 border-l-2 border-sky-400 p-2 mt-1.5 rounded text-xs text-sky-900 leading-relaxed">
                  💡 <strong>Mẹo nhỏ khi tạo mới nhân viên</strong>: Đối với tài khoản nhân viên mới chưa có trên hệ thống, API <code>tokenSdk</code> sẽ tự động khởi tạo tài khoản và gán trực tiếp các hotline được truyền trong <code>hotline_codes</code>. Hãy nhớ <strong>phải tải danh sách hotline trước</strong> (qua API <code>GET /api/hotline/getAll</code>) để lấy đúng mã hotline truyền vào.
                </div>
              </li>
              <li>
                <strong>Bước 1.2: Lấy thông tin Thành viên (Nhân viên)</strong>:
                <p className="text-xs text-slate-500 mt-0.5">
                  Gọi API <code>GET /api/member/getByMemberNo?member_no=...</code> để kiểm tra chi tiết thông tin của tài khoản SDK nhân viên vừa thiết lập (bao gồm số dư và hotline).
                </p>
              </li>
              <li>
                <strong>Bước 1.3: Tự động kiểm tra và cấu hình (JIT Provisioning)</strong>:
                <p className="text-xs text-slate-500 mt-0.5">
                  Nếu nhân viên chưa đủ điều kiện thực hiện cuộc gọi, Backend của bạn cần tự động cấu hình bổ sung:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-500 flex flex-col gap-1.5 mt-1.5">
                  <li><strong>Nếu số dư bằng 0</strong>: Thực hiện gọi API <code>POST /api/member/addMoney</code> để nạp tiền làm ngân sách cuộc gọi cho nhân viên.</li>
                  <li><strong>Nếu hotline chưa được gán</strong>: Gọi API <code>POST /api/hotline/member/add</code> để gán thêm hotline hoạt động cho nhân viên.</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>

        {/* CELL 3: Code Cell (Node.js API Request) */}
        <div className="flex py-2 px-6 group hover:bg-slate-50/50">
          <div className="w-16 flex-none text-right pr-4 font-mono text-xs text-sky-700 font-bold select-none pt-3">
            In [1]:
          </div>
          {renderBackendCode()}
        </div>

        {/* CELL 4: Code Output (Response JSON) */}
        <div className="flex py-2 px-6 group hover:bg-slate-50/50">
          <div className="w-16 flex-none text-right pr-4 font-mono text-xs text-red-600 font-bold select-none pt-1">
            Out [1]:
          </div>
          <div className="flex-1 font-mono text-sm text-slate-600 overflow-x-auto whitespace-pre leading-relaxed pl-1 pt-1">
            <span className="text-slate-400">// Kết quả trả về chứa JWT Token dùng dưới Client</span>
            {"\n"}&#123;
            {"\n"}  <span className="text-emerald-700">"error"</span>: <span className="text-amber-600">0</span>,
            {"\n"}  <span className="text-emerald-700">"message"</span>: <span className="text-emerald-600">"success"</span>,
            {"\n"}  <span className="text-emerald-700">"data"</span>: <span className="text-sky-700">"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey..."</span>
            {"\n"}&#125;
          </div>
        </div>

        {/* FRAMEWORK SWITCHER HEADER */}
        <div className="flex items-center justify-between border-t border-slate-200 mt-8 pt-6 px-6 bg-slate-50/50 pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cấu hình Client</span>
            <h3 className="text-sm font-bold text-slate-800">Chọn Framework của Frontend:</h3>
          </div>
          <div className="flex bg-white border border-slate-200 rounded p-1 shadow-xs">
            {(['html', 'react', 'vue', 'svelte'] as Framework[]).map((fw) => (
              <button
                key={fw}
                onClick={() => setFramework(fw)}
                className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all duration-150 flex items-center gap-1.5 ${
                  framework === fw
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {fw === 'html' && <Icon icon="logos:html-5" className="text-xs" />}
                {fw === 'react' && <Icon icon="logos:react" className="text-xs" />}
                {fw === 'vue' && <Icon icon="logos:vue" className="text-xs" />}
                {fw === 'svelte' && <Icon icon="logos:svelte-icon" className="text-xs" />}
                <span className="capitalize">{fw === 'html' ? 'HTML Thuần' : fw}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CELL 5: Markdown Cell */}
        <div className="flex py-2 px-6 group hover:bg-slate-50/50">
          <div className="w-16 flex-none text-right pr-4 font-mono text-xs text-slate-300 select-none pt-1" />
          <div className="flex-1 prose prose-slate max-w-none">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">2</span>
              Bước 2 & 3: Nhúng và Khai báo thẻ &lt;vbot-widget&gt;
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              Khai báo Custom Element <code>&lt;vbot-widget&gt;</code> tương ứng với framework của bạn để khởi tạo bàn phím gọi điện.
            </p>
          </div>
        </div>

        {/* CELL 6: Code Cell (Frontend Embed & Declaration) */}
        <div className="flex py-2 px-6 group hover:bg-slate-50/50">
          <div className="w-16 flex-none text-right pr-4 font-mono text-xs text-sky-700 font-bold select-none pt-3">
            In [2]:
          </div>
          {renderFrontendCode()}
        </div>

        {/* CELL 7: Markdown Cell */}
        <div className="flex py-2 px-6 group hover:bg-slate-50/50 mt-6">
          <div className="w-16 flex-none text-right pr-4 font-mono text-xs text-slate-300 select-none pt-1" />
          <div className="flex-1 prose prose-slate max-w-none">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">3</span>
              Bước 4: Sử dụng Javascript API và Lắng nghe sự kiện
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              Gọi các phương thức tương tác hoặc lắng nghe các sự kiện gửi ra để xử lý các nghiệp vụ CRM của bạn.
            </p>
          </div>
        </div>

        {/* CELL 8: Code Cell (API Interaction / Event Listening) */}
        <div className="flex py-2 px-6 group hover:bg-slate-50/50">
          <div className="w-16 flex-none text-right pr-4 font-mono text-xs text-sky-700 font-bold select-none pt-3">
            In [3]:
          </div>
          {renderInteractionCode()}
        </div>

        {/* CELL 9: Markdown Cell */}
        <div className="flex py-2 px-6 group hover:bg-slate-50/50 mt-6 border-t border-slate-100 pt-6">
          <div className="w-16 flex-none text-right pr-4 font-mono text-xs text-slate-300 select-none pt-1" />
          <div className="flex-1 prose prose-slate max-w-none">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-2">
              <Icon icon="solar:check-circle-bold" className="text-emerald-500 text-lg" />
              Kết luận
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bạn đã hoàn thành xem qua các bước cơ bản để tích hợp VBot Web SDK. Hãy sử dụng bảng cài đặt ở góc phải để kết nối thử nghiệm thật bằng API Key của bạn hoặc tham khảo mã nguồn tích hợp mẫu trong tệp <code>src/App.tsx</code>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
