# Themis Law Firm Website

This project is an interactive and modern website for Themis Law Firm. It allows users to learn more about the firm, explore its services, and contact the lawyers. The project utilizes **Three.js** to display interactive 3D models with animations. Additionally, it is built and optimized using **Webpack**.

## Features

- **Interactive Loading Animation**: A sleek loading animation is shown while the page loads.
- **3D Model Support**: Uses **Three.js** to dynamically load models from Blender and display them in the scene.
- **Scene Transitions**: When users switch between different services, the scene updates with relevant models and content via smooth animations.
- **Responsive Design**: The website is optimized for desktop devices and displays a warning message for mobile users.
- **Contact Form**: Users can fill out a contact form to get in touch with the lawyers.
- **Webpack Build Process**: Configured with Webpack, the project has separate settings for development and production environments.

## Installation

1. Clone the project to your local machine:
   ```bash
   git clone https://github.com/user/themis-law.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the project in development mode:
   ```bash
   npm run dev
   ```

4. To build the project for production:
   ```bash
   npm run build
   ```

## Configuration

This project is configured with Webpack and includes `webpack.common.js`, `webpack.dev.js`, and `webpack.prod.js` files. The development mode runs a local server, while the production mode handles code minification and cleanup.

## Technologies

- **HTML5 / CSS3**
- **Three.js**: 3D models and animations
- **Webpack**: Module bundling and build process
- **Babel**: ES6+ JavaScript transpilation

## License

This project is **UNLICENSED**.
