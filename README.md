# Speelgoed Zoeker (Toy Finder)

## 🚀 Live Demo

> **[Visit the Live Site](https://maartenn.github.io/speelotheek-search/)**
>
> Explore the Speelgoed Zoeker now and find the perfect toy!
>


## Overview

Speelgoed Zoeker is a web application designed to help users find and filter toys based on various criteria such as age range, number of players, toy type, developmental goals, and themes. This project is built using React and TypeScript, providing a responsive and user-friendly interface for browsing a toy catalog.

## Features

- Search functionality to find toys by keywords
- Filter toys by:
    - Age range
    - Number of players
    - Toy type
    - Developmental goals
    - Themes
- Responsive design for desktop and mobile devices
- Lazy loading of images for improved performance
- Detailed view of individual toys

## Getting Started

### Prerequisites

- Node.js (version 14 or later recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/maartenn/speelotheek-search.git
   cd speelotheek-search
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Building for Production

To create a production build:

```
npm run build
```

This will create a `build` directory with the production-ready files.

## Deployment

This project is set up to deploy automatically to GitHub Pages using GitHub Actions. Any push to the `main` branch will trigger a build and deploy process.

To set up deployment:

1. Ensure your repository is public or you have a GitHub Pro account.
2. Go to your repository settings and enable GitHub Pages.
3. Set the source to the `gh-pages` branch.

## Project Structure

- `src/App.tsx`: Main component containing the Toy Finder logic
- `public/catalogus.json`: JSON file containing the toy data
- `public/img/`: Directory containing toy images

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- This project uses [Create React App](https://create-react-app.dev/) as its foundation.
- Icons provided by [Lucide](https://lucide.dev/).
- Styling implemented with [Tailwind CSS](https://tailwindcss.com/).