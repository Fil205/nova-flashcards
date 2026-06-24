/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				// App background
				'fc-bg':           '#05060A',
				'fc-bg-2':         '#0C0D14',
				// Glass surfaces
				'fc-glass':        'rgba(255,255,255,0.04)',
				'fc-glass-hover':  'rgba(255,255,255,0.07)',
				'fc-border':       'rgba(255,255,255,0.08)',
				'fc-border-hover': 'rgba(255,255,255,0.18)',
				// Text
				'fc-text':         '#F0F2FF',
				'fc-muted':        'rgba(240,242,255,0.55)',
				'fc-faint':        'rgba(240,242,255,0.30)',
				// Accent — violet/indigo
				'fc-accent':       '#7C3AED',
				'fc-accent-2':     '#6D28D9',
				'fc-accent-light': '#A78BFA',
				// Status
				'fc-success':      '#10B981',
				'fc-warning':      '#F59E0B',
				'fc-danger':       '#EF4444',
				'fc-partial':      '#F59E0B',
			},
			fontFamily: {
				sans:    ['Inter', 'system-ui', 'sans-serif'],
				mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
				display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
			},
			backgroundImage: {
				'fc-gradient':       'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
				'fc-gradient-hover': 'linear-gradient(135deg, #6D28D9 0%, #2563EB 100%)',
				'fc-glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
			},
			boxShadow: {
				'glass':    '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
				'glass-lg': '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
				'glow':     '0 0 24px rgba(124,58,237,0.35)',
				'glow-sm':  '0 0 12px rgba(124,58,237,0.25)',
			},
			animation: {
				'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
			},
			backdropBlur: {
				xs: '2px',
			},
			borderRadius: {
				'xl2': '1.25rem',
				'2xl': '1.5rem',
			},
		},
	},
	plugins: [],
};
