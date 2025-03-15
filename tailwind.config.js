const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.tsx',
    './src/components/**/*.tsx',
	'./src/components/custom/**/*.tsx',
	'./src/components/ui/**/*.tsx',
    './src/layouts/**/*.tsx',
  ],
  theme: {
  	extend: {
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
  			}
  		},
  		borderRadius: {
  			lg: '`var(--radius)`',
  			md: '`calc(var(--radius) - 2px)`',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		animation: {
  			meteor: 'meteor 5s linear infinite'
  		},
  		keyframes: {
  			meteor: {
  				'0%': {
  					transform: 'rotate(215deg) translateX(0)',
  					opacity: '1'
  				},
  				'70%': {
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'rotate(215deg) translateX(-500px)',
  					opacity: '0'
  				}
  			}
  		},
		typography(theme) {
			return {
				DEFAULT: {
					css: {
						pre: {
							maxWidth: '100%',
							overflowX: 'auto',
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word',
							padding: '1rem',
							borderRadius: '0.375rem',
							display: 'block'
						},
						code: {
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word',
							padding: '0.2em 0.4em',
							borderRadius: '0.25rem',
							fontSize: '0.875em'
						},
						'pre code': {
							display: 'block',
							padding: '0',
							backgroundColor: 'transparent',
							borderRadius: '0'
						},
						'.prose': {
							overflow: 'hidden'
						}
					}
				},
				dark: {
					css: {
						color: theme("colors.gray.100"),
						'[class~="lead"]': { color: theme("colors.gray.200") },
						a: { color: theme("colors.blue.500") },
						strong: { color: theme("colors.gray.100") },
						"ul > li::before": { backgroundColor: theme("colors.gray.600") },
						hr: { borderColor: theme("colors.gray.700") },
						blockquote: {
							color: theme("colors.gray.100"),
							borderLeftColor: theme("colors.gray.700"),
						},
						h1: { color: theme("colors.gray.100") },
						h2: { color: theme("colors.gray.100") },
						h3: { color: theme("colors.gray.100") },
						h4: { color: theme("colors.gray.100") },
						code: { color: theme("colors.gray.100") },
						"a code": { color: theme("colors.blue.500") },
						pre: {
							color: theme("colors.gray.200"),
							backgroundColor: theme("colors.gray.800"),
							maxWidth: '100%',
							overflowX: 'auto',
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word',
							padding: '1rem',
							borderRadius: '0.375rem',
							display: 'block'
						},
						thead: {
							color: theme("colors.gray.100"),
							borderBottomColor: theme("colors.gray.600"),
						},
						"tbody tr": { borderBottomColor: theme("colors.gray.700") },
						'pre code': {
							display: 'block',
							padding: '0',
							backgroundColor: 'transparent',
							borderRadius: '0'
						}
					},
				},
			};
		},
  	}
  },

  variants: {
    extend: { typography: ["dark"] }
  },
  
  plugins: [
	require("tailwindcss-animate"),
	require('@tailwindcss/typography'),
],
}

