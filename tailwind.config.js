export default {
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { 'background-position': '-200px 0' },
          '100%': { 'background-position': '200px 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.3s infinite linear',
      },
      backgroundSize: {
        '200%': '200% 100%',
      },
    },
  },
};
