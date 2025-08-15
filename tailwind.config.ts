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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))',
					bold: 'hsl(var(--primary-bold))'
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
					foreground: 'hsl(var(--accent-foreground))',
					bold: 'hsl(var(--accent-bold))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Enhanced Cyberpunk Color Palette
				'neon-green': {
					DEFAULT: 'hsl(var(--neon-green))',
					foreground: 'hsl(var(--neon-green-foreground))',
					glow: 'hsl(var(--neon-green-glow))'
				},
				'neon-purple': {
					DEFAULT: 'hsl(var(--neon-purple))',
					foreground: 'hsl(var(--neon-purple-foreground))',
					glow: 'hsl(var(--neon-purple-glow))'
				},
				'neon-orange': {
					DEFAULT: 'hsl(var(--neon-orange))',
					foreground: 'hsl(var(--neon-orange-foreground))',
					glow: 'hsl(var(--neon-orange-glow))'
				},
				'neon-red': {
					DEFAULT: 'hsl(var(--neon-red))',
					foreground: 'hsl(var(--neon-red-foreground))',
					glow: 'hsl(var(--neon-red-glow))'
				},
				'neon-yellow': {
					DEFAULT: 'hsl(var(--neon-yellow))',
					foreground: 'hsl(var(--neon-yellow-foreground))',
					glow: 'hsl(var(--neon-yellow-glow))'
				},
				'electric-blue': {
					DEFAULT: 'hsl(var(--electric-blue))',
					foreground: 'hsl(var(--electric-blue-foreground))',
					glow: 'hsl(var(--electric-blue-glow))'
				},
				'cyber-pink': {
					DEFAULT: 'hsl(var(--cyber-pink))',
					foreground: 'hsl(var(--cyber-pink-foreground))',
					glow: 'hsl(var(--cyber-pink-glow))'
				},
				// Status and Phase Colors
				status: {
					planned: 'hsl(var(--status-planned))',
					'in-progress': 'hsl(var(--status-in-progress))',
					complete: 'hsl(var(--status-complete))',
					delayed: 'hsl(var(--status-delayed))',
					blocked: 'hsl(var(--status-blocked))',
					review: 'hsl(var(--status-review))'
				},
				phase: {
					discovery: 'hsl(var(--phase-discovery))',
					planning: 'hsl(var(--phase-planning))',
					implementation: 'hsl(var(--phase-implementation))',
					testing: 'hsl(var(--phase-testing))',
					deployment: 'hsl(var(--phase-deployment))',
					maintenance: 'hsl(var(--phase-maintenance))'
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
				navigation: {
					DEFAULT: 'hsl(var(--nav-background))',
					foreground: 'hsl(var(--nav-foreground))',
					border: 'hsl(var(--nav-border))',
					hover: 'hsl(var(--nav-hover))',
					active: 'hsl(var(--nav-active))'
				}
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
				'pulse-glow': {
					'0%, 100%': {
						opacity: '1',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.8',
						transform: 'scale(1.05)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'slide-up': 'slide-up 0.6s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-glow': 'var(--gradient-glow)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-button': 'var(--gradient-button)',
				'gradient-accent': 'var(--gradient-accent)',
				// Enhanced Cyberpunk Gradients
				'gradient-neon-green': 'var(--gradient-neon-green)',
				'gradient-neon-purple': 'var(--gradient-neon-purple)',
				'gradient-neon-orange': 'var(--gradient-neon-orange)',
				'gradient-electric-cyber': 'var(--gradient-electric-cyber)',
				'gradient-matrix': 'var(--gradient-matrix)',
				'gradient-cyber-wave': 'var(--gradient-cyber-wave)',
				'gradient-neon-dreams': 'var(--gradient-neon-dreams)',
				'gradient-digital-rain': 'var(--gradient-digital-rain)',
				'gradient-progress': 'var(--gradient-progress)',
				'gradient-chart': 'var(--gradient-chart)',
				'gradient-chart-alt': 'var(--gradient-chart-alt)',
				'gradient-status': 'var(--gradient-status)',
				'gradient-metric': 'var(--gradient-metric)'
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'elevated': 'var(--shadow-elevated)',
				'subtle': 'var(--shadow-subtle)',
				'hover': 'var(--shadow-hover)'
			},
			transitionTimingFunction: {
				'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
			},
			animationDelay: {
				'100': '0.1s',
				'200': '0.2s',
				'300': '0.3s',
				'2000': '2s',
				'4000': '4s'
			},
			fontFamily: {
				sans: ["Space Grotesk", "sans-serif"],
				display: ["Orbitron", "sans-serif"],
				tech: ["Rajdhani", "monospace"],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
