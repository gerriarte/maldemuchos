<!DOCTYPE html>

<html class="dark" lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            font-family: 'Space Grotesk', sans-serif;
            background-color: #131313;
        }
        .hard-shadow-primary {
            box-shadow: 4px 4px 0px 0px #ffb4aa;
        }
        .hard-shadow-secondary {
            box-shadow: 4px 4px 0px 0px #d7ef00;
        }
        .hard-shadow-white {
            box-shadow: 4px 4px 0px 0px #ffffff;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #d7ef00 !important;
            box-shadow: 4px 4px 0px 0px #d7ef00;
        }
        /* Custom scrollbar for brutalist look */
        ::-webkit-scrollbar {
            width: 12px;
        }
        ::-webkit-scrollbar-track {
            background: #131313;
            border-left: 2px solid #ffffff;
        }
        ::-webkit-scrollbar-thumb {
            background: #ffb4aa;
            border: 2px solid #ffffff;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "tertiary": "#c6c6c7",
                "primary-fixed-dim": "#ffb4aa",
                "on-primary": "#690003",
                "secondary-fixed": "#d7ef00",
                "surface-tint": "#ffb4aa",
                "on-primary-fixed-variant": "#930005",
                "secondary": "#ffffff",
                "on-secondary-fixed": "#1a1e00",
                "primary": "#ffb4aa",
                "on-tertiary": "#2f3131",
                "on-tertiary-fixed": "#1a1c1c",
                "surface": "#131313",
                "secondary-fixed-dim": "#bcd200",
                "tertiary-container": "#909191",
                "inverse-on-surface": "#303030",
                "on-error": "#690005",
                "surface-container-lowest": "#0e0e0e",
                "tertiary-fixed": "#e2e2e2",
                "on-primary-fixed": "#410001",
                "outline": "#ad8883",
                "on-background": "#e2e2e2",
                "on-secondary-fixed-variant": "#434b00",
                "on-surface-variant": "#e7bdb7",
                "surface-container-high": "#2a2a2a",
                "surface-dim": "#131313",
                "inverse-primary": "#c0000a",
                "error-container": "#93000a",
                "primary-container": "#ff5545",
                "surface-container-low": "#1b1b1b",
                "on-error-container": "#ffdad6",
                "tertiary-fixed-dim": "#c6c6c7",
                "surface-bright": "#393939",
                "on-tertiary-container": "#282a2a",
                "primary-fixed": "#ffdad5",
                "on-secondary-container": "#5f6a00",
                "surface-container": "#1f1f1f",
                "surface-container-highest": "#353535",
                "on-surface": "#e2e2e2",
                "on-primary-container": "#5c0002",
                "on-tertiary-fixed-variant": "#454747",
                "on-secondary": "#2d3400",
                "background": "#131313",
                "outline-variant": "#5d3f3b",
                "secondary-container": "#d7ef00",
                "error": "#ffb4ab",
                "surface-variant": "#353535",
                "inverse-surface": "#e2e2e2"
              },
              fontFamily: {
                "headline": ["Space Grotesk"],
                "body": ["Space Grotesk"],
                "label": ["Space Grotesk"]
              },
              borderRadius: {"DEFAULT": "0px", "lg": "0px", "xl": "0px", "full": "9999px"},
            },
          },
        }
      </script>
</head>
<body class="bg-background text-on-surface selection:bg-secondary-fixed selection:text-black">
<!-- TopNavBar -->
<nav class="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-20 bg-black border-b-4 border-white shadow-[8px_8px_0px_0px_rgba(215,239,0,1)]">
<div class="text-4xl font-black italic bg-[#ffb4aa] text-black px-4 py-1 border-2 border-white font-['Space_Grotesk'] uppercase tracking-tighter">
            MAL DE MUCHOS
        </div>
<div class="hidden md:flex gap-8 font-['Space_Grotesk'] uppercase tracking-tighter font-black text-2xl">
<a class="text-[#d7ef00] underline decoration-4 underline-offset-8" href="#">LIVE FEED</a>
<a class="text-white hover:bg-[#ffb4aa] hover:text-black transition-none px-2" href="#">RANKINGS</a>
<a class="text-white hover:bg-[#ffb4aa] hover:text-black transition-none px-2" href="#">THE ARCHIVE</a>
</div>
<button class="bg-primary-container text-on-primary-container px-6 py-2 border-2 border-white font-black uppercase tracking-widest hover:bg-secondary-fixed hover:text-black transition-none active:translate-x-1 active:translate-y-1 active:shadow-none">
            VENT NOW
        </button>
</nav>
<div class="flex pt-20">
<!-- SideNavBar / Ranking Sidebar -->
<aside class="fixed left-0 top-20 w-80 h-[calc(100vh-80px)] hidden lg:flex flex-col border-r-4 border-white bg-black overflow-y-auto">
<div class="p-6 border-b-2 border-white">
<h2 class="text-primary font-black text-2xl uppercase tracking-tighter mb-1">THE WALL OF SHAME</h2>
<p class="text-secondary-fixed font-mono text-xs">TOP OFFENDERS | REAL-TIME</p>
</div>
<div class="flex-1">
<!-- Ranking Item 1 -->
<div class="flex items-center p-4 border-b-2 border-white hover:bg-surface-container-highest group transition-none">
<span class="text-4xl font-black text-white mr-4 italic opacity-30 group-hover:opacity-100">01</span>
<div class="flex-1">
<h3 class="font-black text-white uppercase text-lg">GLOBAL_TELCO</h3>
<div class="flex items-center gap-2">
<span class="text-primary font-bold">9.8</span>
<span class="text-[10px] bg-primary text-black px-1 font-black">HATE SCORE</span>
</div>
</div>
<span class="material-symbols-outlined text-primary text-4xl" data-weight="fill">arrow_drop_up</span>
</div>
<!-- Ranking Item 2 -->
<div class="flex items-center p-4 border-b-2 border-white hover:bg-surface-container-highest group transition-none">
<span class="text-4xl font-black text-white mr-4 italic opacity-30 group-hover:opacity-100">02</span>
<div class="flex-1">
<h3 class="font-black text-white uppercase text-lg">BANK_OF_DESPAIR</h3>
<div class="flex items-center gap-2">
<span class="text-primary font-bold">9.4</span>
<span class="text-[10px] bg-primary text-black px-1 font-black">HATE SCORE</span>
</div>
</div>
<span class="material-symbols-outlined text-primary text-4xl" data-weight="fill">arrow_drop_up</span>
</div>
<!-- Ranking Item 3 -->
<div class="flex items-center p-4 border-b-2 border-white hover:bg-surface-container-highest group transition-none">
<span class="text-4xl font-black text-white mr-4 italic opacity-30 group-hover:opacity-100">03</span>
<div class="flex-1">
<h3 class="font-black text-white uppercase text-lg">TRANSIT_VOID</h3>
<div class="flex items-center gap-2">
<span class="text-primary font-bold">8.9</span>
<span class="text-[10px] bg-primary text-black px-1 font-black">HATE SCORE</span>
</div>
</div>
<span class="material-symbols-outlined text-secondary-fixed text-4xl" data-weight="fill">arrow_drop_down</span>
</div>
<!-- Ranking Item 4-10 Placeholder rows -->
<div class="p-4 border-b-2 border-white opacity-50 grayscale">
<div class="flex justify-between items-center">
<span class="font-black text-white">04 ENERGY_BLACKOUT</span>
<span class="text-primary">8.2</span>
</div>
</div>
<div class="p-4 border-b-2 border-white opacity-40 grayscale">
<div class="flex justify-between items-center">
<span class="font-black text-white">05 LOGISTICS_LOST</span>
<span class="text-primary">7.5</span>
</div>
</div>
<div class="p-4 border-b-2 border-white opacity-30 grayscale">
<div class="flex justify-between items-center">
<span class="font-black text-white">06 TAX_CRUSHER</span>
<span class="text-primary">7.1</span>
</div>
</div>
</div>
<div class="p-4 bg-surface-container-low border-t-2 border-white">
<div class="flex items-center gap-3">
<div class="w-10 h-10 border-2 border-white bg-primary"></div>
<div>
<p class="font-black text-sm text-white">OPERATOR_01</p>
<p class="text-[10px] text-secondary-fixed">STATUS: AGITATED</p>
</div>
</div>
<button class="w-full mt-4 bg-secondary-fixed text-black font-black py-2 border-2 border-black hover:bg-white transition-none">
                    POST COMPLAINT
                </button>
</div>
</aside>
<!-- Main Content Area -->
<main class="flex-1 ml-0 lg:ml-80 p-6 md:p-12 min-h-screen">
<!-- THE VENT BOX -->
<section class="max-w-4xl mx-auto mb-20">
<div class="bg-surface-container border-4 border-white hard-shadow-primary p-8">
<div class="flex items-center gap-4 mb-6">
<span class="material-symbols-outlined text-primary text-5xl" data-weight="fill">campaign</span>
<h1 class="text-5xl font-black uppercase italic tracking-tighter">THE VENT BOX</h1>
</div>
<div class="space-y-6">
<div>
<label class="block text-secondary-fixed font-black uppercase text-sm mb-2">TARGET ENTITY</label>
<div class="relative">
<input class="w-full bg-black border-2 border-white p-4 text-white font-black placeholder:opacity-30 uppercase" placeholder="COMPANY NAME / ENTITY..." type="text"/>
<span class="absolute right-4 top-4 material-symbols-outlined text-white">search</span>
</div>
</div>
<div>
<label class="block text-secondary-fixed font-black uppercase text-sm mb-2">YOUR RAGE</label>
<textarea class="w-full bg-black border-2 border-white p-4 text-white font-mono placeholder:opacity-30 resize-none" placeholder="¿Quién te jodió el día hoy? Escupilo acá..." rows="4"></textarea>
</div>
<div class="flex flex-col md:flex-row gap-8 items-start md:items-center">
<div class="flex-1 w-full">
<label class="block text-secondary-fixed font-black uppercase text-sm mb-2">INTENSITY SCALE (1-10)</label>
<div class="flex justify-between gap-1">
<button class="flex-1 h-12 border-2 border-white bg-[#ffff00] hover:scale-105 transition-none"></button>
<button class="flex-1 h-12 border-2 border-white bg-[#ffea00] hover:scale-105 transition-none"></button>
<button class="flex-1 h-12 border-2 border-white bg-[#ffd500] hover:scale-105 transition-none"></button>
<button class="flex-1 h-12 border-2 border-white bg-[#ffbf00] hover:scale-105 transition-none"></button>
<button class="flex-1 h-12 border-2 border-white bg-[#ffaa00] hover:scale-105 transition-none"></button>
<button class="flex-1 h-12 border-2 border-white bg-[#ff9500] hover:scale-105 transition-none"></button>
<button class="flex-1 h-12 border-2 border-white bg-[#ff7b00] hover:scale-105 transition-none"></button>
<button class="flex-1 h-12 border-2 border-white bg-[#ff5500] hover:scale-105 transition-none"></button>
<button class="flex-1 h-12 border-2 border-white bg-[#ff3300] hover:scale-105 transition-none"></button>
<button class="flex-1 h-12 border-2 border-white bg-primary hover:scale-105 transition-none flex items-center justify-center">
<span class="material-symbols-outlined text-black" data-weight="fill">local_fire_department</span>
</button>
</div>
<div class="flex justify-between mt-2 font-black text-[10px] uppercase opacity-50">
<span>Mild Annoyance</span>
<span>Pure Hatred</span>
</div>
</div>
<button class="w-full md:w-auto bg-secondary-fixed text-black px-10 py-5 font-black text-2xl border-4 border-black hard-shadow-white hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_white] active:translate-x-0 active:translate-y-0 active:shadow-none transition-none">
                                SOLTAR VENENO
                            </button>
</div>
</div>
</div>
</section>
<!-- THE GOSSIP-O-METER -->
<section class="max-w-4xl mx-auto">
<div class="flex justify-between items-end mb-10 border-b-4 border-white pb-4">
<h2 class="text-4xl font-black uppercase tracking-tighter">THE GOSSIP-O-METER</h2>
<div class="flex gap-4">
<span class="text-secondary-fixed font-black text-xs">LIVE FEED: ON</span>
<div class="w-3 h-3 bg-primary animate-pulse"></div>
</div>
</div>
<!-- Feed Grid -->
<div class="grid grid-cols-1 gap-12">
<!-- Complaint Card 1 -->
<div class="bg-surface-container border-2 border-white hard-shadow-secondary group">
<div class="bg-primary text-black p-4 flex justify-between items-center border-b-2 border-white">
<div class="flex items-center gap-3">
<span class="font-black text-xl uppercase italic">GLOBAL_TELCO</span>
<span class="text-[10px] font-bold border border-black px-1">UX TERRIBLE</span>
</div>
<span class="font-mono text-xs font-black">HACE 2 MIN</span>
</div>
<div class="p-6">
<p class="font-mono text-lg text-white leading-relaxed">
                                Llevo 3 horas en espera con una música de ascensor que suena a distorsión pura. Cuando finalmente atienden, me cortan. ES LA QUINTA VEZ. ¿Para qué pago una suscripción premium si me tratan como basura radioactiva?
                            </p>
</div>
<div class="p-4 bg-black flex flex-wrap gap-4 border-t-2 border-white">
<button class="flex items-center gap-2 bg-surface-container-highest px-4 py-2 border border-white hover:bg-secondary-fixed hover:text-black transition-none font-black text-xs uppercase">
<span class="material-symbols-outlined text-sm">repeat</span>
                                A MÍ TAMBIÉN ME PASÓ (42)
                            </button>
<button class="flex items-center gap-2 bg-surface-container-highest px-4 py-2 border border-white hover:bg-primary hover:text-black transition-none font-black text-xs uppercase">
<span class="material-symbols-outlined text-sm">mood_bad</span>
                                INDIGNANTE (128)
                            </button>
<button class="ml-auto flex items-center gap-2 text-secondary-fixed hover:text-white transition-none font-black text-xs uppercase">
<span class="material-symbols-outlined">share</span>
                                COMPARTIR EL CHISME
                            </button>
</div>
</div>
<!-- Complaint Card 2 -->
<div class="bg-surface-container border-2 border-white hard-shadow-primary group translate-x-4">
<div class="bg-secondary-fixed text-black p-4 flex justify-between items-center border-b-2 border-white">
<div class="flex items-center gap-3">
<span class="font-black text-xl uppercase italic">TRANSIT_VOID</span>
<span class="text-[10px] font-bold border border-black px-1">LOGÍSTICA FAIL</span>
</div>
<span class="font-mono text-xs font-black">HACE 15 MIN</span>
</div>
<div class="p-6">
<p class="font-mono text-lg text-white leading-relaxed">
                                El conductor marcó "entregado" y subió una foto de sus propios pies en el camión. Mi paquete no está. El soporte técnico me dice que "tenga paciencia". PACIENCIA ES LO QUE NO TENGO PARA ESTA ESTAFA.
                            </p>
</div>
<div class="p-4 bg-black flex flex-wrap gap-4 border-t-2 border-white">
<button class="flex items-center gap-2 bg-surface-container-highest px-4 py-2 border border-white hover:bg-secondary-fixed hover:text-black transition-none font-black text-xs uppercase">
<span class="material-symbols-outlined text-sm">repeat</span>
                                A MÍ TAMBIÉN ME PASÓ (12)
                            </button>
<button class="flex items-center gap-2 bg-surface-container-highest px-4 py-2 border border-white hover:bg-primary hover:text-black transition-none font-black text-xs uppercase">
<span class="material-symbols-outlined text-sm">mood_bad</span>
                                INDIGNANTE (56)
                            </button>
<button class="ml-auto flex items-center gap-2 text-secondary-fixed hover:text-white transition-none font-black text-xs uppercase">
<span class="material-symbols-outlined">share</span>
                                COMPARTIR EL CHISME
                            </button>
</div>
</div>
<!-- Complaint Card 3 (Redacted state) -->
<div class="bg-surface-container-lowest border-2 border-white hard-shadow-white group -translate-x-4">
<div class="bg-white text-black p-4 flex justify-between items-center border-b-2 border-white">
<div class="flex items-center gap-3">
<span class="font-black text-xl uppercase italic bg-black text-white px-2">REDACTED_CORP</span>
<span class="text-[10px] font-bold border border-black px-1">OFF-THE-RECORD</span>
</div>
<span class="font-mono text-xs font-black">HACE 1 HORA</span>
</div>
<div class="p-6 bg-black">
<p class="font-mono text-lg text-primary leading-relaxed">
                                [CONTENIDO CENSURADO POR EL PROTOCOLO DE PRIVACIDAD] Intentaron cobrarme una comisión de mantenimiento sobre una cuenta que cerré hace dos años. Son parásitos financieros de la peor calaña. No descansen.
                            </p>
</div>
<div class="p-4 bg-black flex flex-wrap gap-4 border-t-2 border-white">
<button class="flex items-center gap-2 bg-surface-container-highest px-4 py-2 border border-white hover:bg-secondary-fixed hover:text-black transition-none font-black text-xs uppercase">
<span class="material-symbols-outlined text-sm">repeat</span>
                                A MÍ TAMBIÉN ME PASÓ (89)
                            </button>
<button class="flex items-center gap-2 bg-surface-container-highest px-4 py-2 border border-white hover:bg-primary hover:text-black transition-none font-black text-xs uppercase">
<span class="material-symbols-outlined text-sm">mood_bad</span>
                                INDIGNANTE (312)
                            </button>
<button class="ml-auto flex items-center gap-2 text-secondary-fixed hover:text-white transition-none font-black text-xs uppercase">
<span class="material-symbols-outlined">share</span>
                                COMPARTIR EL CHISME
                            </button>
</div>
</div>
</div>
<div class="mt-20 flex justify-center">
<button class="bg-black border-4 border-white text-white px-12 py-4 font-black text-xl uppercase hover:bg-primary hover:text-black transition-none hard-shadow-secondary">
                        LOAD MORE ANGER
                    </button>
</div>
</section>
</main>
</div>
<!-- Footer -->
<footer class="w-full py-12 px-10 flex flex-col md:flex-row justify-between items-center bg-black border-t-4 border-white mt-20">
<div class="text-[#d7ef00] font-black text-2xl font-['Space_Grotesk'] mb-6 md:mb-0">
            MAL DE MUCHOS
        </div>
<div class="flex flex-wrap justify-center gap-8 font-['Space_Grotesk'] font-mono text-xs mb-6 md:mb-0">
<a class="text-[#353535] hover:text-[#ffb4aa] uppercase" href="#">MANIFESTO</a>
<a class="text-[#353535] hover:text-[#ffb4aa] uppercase" href="#">LEGAL TRASH</a>
<a class="text-[#353535] hover:text-[#ffb4aa] uppercase" href="#">CONTACT RADIUS</a>
</div>
<div class="text-white font-mono text-xs uppercase opacity-50">
            NO SILENCE. NO GRACE. 2024.
        </div>
</footer>
</body></html>