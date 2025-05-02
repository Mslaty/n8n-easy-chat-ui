
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			spacing: {
				'10px': '10px',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				chat: {
					dark: '#121212',
					'dark-secondary': '#1a1a1a',
					'user-bubble': '#4C4593',
					'agent-bubble': '#1A1A1A',
					'accent': '#8B5CF6',
					'accent-hover': '#6E59A5',
					'blue': '#3B82F6',
					'blue-hover': '#2563EB',
					'green': '#10B981',
					'green-hover': '#059669',
					'orange': '#F97316',
					'orange-hover': '#EA580C',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'typing': {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				},
				'blink': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' }
				},
				'bounce-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'timer-blink': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'typing': 'typing 1.5s steps(30, end)',
				'blink': 'blink 0.7s infinite',
				'bounce-in': 'bounce-in 0.3s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'timer-pulse': 'timer-blink 1.5s ease-in-out infinite'
			},
			typography: {
				DEFAULT: {
					css: {
						color: 'inherit',
						a: {
							color: '#3b82f6',
							'&:hover': {
								color: '#60a5fa',
							},
						},
						'h1,h2,h3,h4': {
							color: 'inherit',
							fontWeight: '600',
						},
						code: {
							color: '#ef4444',
							backgroundColor: 'rgba(0, 0, 0, 0.1)',
							padding: '0.125rem 0.25rem',
							borderRadius: '0.25rem',
							fontWeight: '600',
						},
						'code::before': {
							content: '""',
						},
						'code::after': {
							content: '""',
						},
						pre: {
							backgroundColor: 'rgba(0, 0, 0, 0.3)',
							color: '#e5e7eb',
							overflow: 'auto',
							padding: '1rem',
							borderRadius: '0.375rem',
						},
						blockquote: {
							borderLeftColor: '#4b5563',
						},
						hr: {
							borderColor: '#374151',
						},
						ol: {
							li: {
								'&::marker': {
									color: '#6b7280',
								}
							}
						},
						ul: {
							li: {
								'&::marker': {
									color: '#6b7280',
								}
							}
						}
					}
				}
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require('@tailwindcss/typography')
	],
} satisfies Config;
