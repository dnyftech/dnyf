# DNYF TETCH - AI Research & Development Website

A modern, fully-featured portfolio website with AI integration, GitHub integration, PWA support, and more.

## 🌟 Features

### Core Features
- **Modern Design** - Dark/Light theme toggle, responsive layout
- **GitHub Integration** - Real-time project sync, stats, contributions graph
- **AI Terminal Chat** - Interactive AI assistant with commands
- **Contribution Graph** - Visual GitHub activity heatmap
- **PWA Ready** - Install as app on mobile/desktop
- **Offline Support** - Works offline with service worker
- **Live Statistics** - Real-time GitHub stats updates

### Sections
1. **Hero** - Main landing section with stats
2. **Projects** - GitHub projects with search/sort/filter
3. **Contributions** - GitHub activity graph & stats
4. **AI Chat** - Terminal-style AI assistant
5. **Skills** - Language distribution chart & tech stack
6. **About** - About section with expertise areas
7. **Contact** - Contact form & information

## 📁 File Structure

```
dnyf/
├── index.html              # Main HTML file
├── manifest.json          # PWA manifest
├── sw.js                  # Service Worker
├── css/
│   └── style.css         # All styling
├── js/
│   ├── app.js            # Main app logic
│   ├── github.js         # GitHub API integration
│   ├── contributions.js  # Contributions graph
│   ├── ai-chat.js        # AI terminal chat
│   └── pwa.js            # PWA functionality
└── icons/                # App icons (192x192, 512x512, etc)
```

## 🚀 Quick Start

### Local Development

1. **Clone or download files**
   ```bash
   git clone <repo-url>
   cd dnyf-tetch-website
   ```

2. **Start a local server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using Live Server (VS Code extension)
   # Right-click index.html → Open with Live Server
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### GitHub Configuration

Update the GitHub username in the following files:

**js/github.js** (line 2):
```javascript
constructor(username = 'dnyftetch')  // Change 'dnyftetch' to your username
```

**js/contributions.js** (line 2):
```javascript
constructor(username = 'dnyftetch')  // Change 'dnyftetch' to your username
```

**index.html** - Update all GitHub links to your profile

## 🌐 Deployment

### Option 1: Netlify (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo>
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Deploy settings:
     - Build command: (leave blank)
     - Publish directory: `/` (root)
   - Click Deploy

3. **Set custom domain**
   - Go to Site settings → Domain management
   - Add your custom domain

### Option 2: GitHub Pages

1. **Rename repository**
   - Create repo named `<username>.github.io`

2. **Push files**
   ```bash
   git push origin main
   ```

3. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Select `main` branch as source
   - Your site will be live at `https://<username>.github.io`

### Option 3: Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow prompts** to connect your project

### Option 4: Other Hosting

Works with any static hosting service (Firebase, AWS S3, Azure, etc.)

## 🎨 Customization

### Update Personal Information

**index.html** - Update:
- `<title>` - Page title
- `meta description` - SEO description
- GitHub links and usernames
- Contact email in footer
- Social media links

### Colors & Theme

**css/style.css** - Modify CSS variables in `:root`:
```css
:root {
    --primary: #3DDC84;        /* Main accent color */
    --dark: #0a0a0f;           /* Dark background */
    --light: #ffffff;          /* Light text */
    --card-bg: #1a1a2e;        /* Card background */
    /* ... more colors ... */
}
```

### Add App Icons

Replace files in `icons/` folder with your own:
- icon-72x72.png
- icon-192x192.png
- icon-512x512.png
- (and other sizes for full coverage)

## 🔧 Configuration

### GitHub API Limits

The site uses GitHub's public API (60 requests/hour without auth).

**To increase limits** - Create a personal access token:
1. GitHub Settings → Developer settings → Personal access tokens
2. Create token with `repo` scope
3. Add to `js/github.js`:

```javascript
headers: {
    'Authorization': 'token YOUR_TOKEN_HERE',
    'Accept': 'application/vnd.github.v3+json'
}
```

### Contact Form

The contact form currently shows a notification. To actually send emails:

**Option 1: Netlify Forms**
```html
<form name="contact" method="POST" netlify>
    <!-- form fields -->
</form>
```

**Option 2: Formspree**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Option 3: Custom Backend**
Update form submission in `js/app.js` to send to your backend

## 🔍 SEO Optimization

Already configured with:
- Meta description & keywords
- Open Graph tags
- Structured data
- Mobile optimization
- Fast loading (all local assets)

Additional improvements:
1. Add `robots.txt` file
2. Create `sitemap.xml`
3. Submit to Google Search Console
4. Add analytics (Google Analytics, Plausible)

## 📊 Analytics

Add Google Analytics by inserting in `index.html` `<head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 🚀 Performance Tips

- **Lazy load images** - Add `loading="lazy"` to images
- **Compress assets** - Use TinyPNG for images
- **Enable GZIP** - Most hosting providers do this automatically
- **Use CDN** - Netlify/Vercel automatically use CDN

Current Performance:
- ⚡ No build step needed
- 📦 All CSS in one file (optimized)
- 🎯 All JS loaded asynchronously
- ♻️ Service worker caching

## 🐛 Troubleshooting

### GitHub data not loading
- Check if username is correct in `github.js`
- Check browser console for API errors
- GitHub API might be rate limited (wait 1 hour)
- Add auth token for higher limits

### Service Worker issues
- Clear browser cache (Ctrl+Shift+Delete)
- Check DevTools → Application → Service Workers
- Browser must support Service Workers (all modern browsers)

### PWA not installing
- Must be on HTTPS (except localhost)
- Manifest.json must be properly formatted
- Icons must exist and be correct size

### Theme not persisting
- Browser must allow localStorage
- Check if cookies/storage are blocked

## 📱 Mobile Optimization

The site is fully responsive:
- **Mobile first** - Optimized for small screens
- **Touch friendly** - Large tap targets (48px minimum)
- **PWA installable** - Works as mobile app
- **Offline capable** - Service worker caching

## 🔒 Security

- No dependencies needed (no npm packages to compromise)
- All API calls from client-side (secure, no backend needed)
- No stored sensitive data
- GitHub API token can be safely public

## 📈 Next Steps

1. **Deploy** - Choose hosting platform and deploy
2. **Customize** - Update colors, content, links
3. **Add icons** - Replace placeholder icons with your own
4. **Setup domain** - Configure custom domain
5. **Optimize** - Add analytics, improve SEO
6. **Maintain** - Keep content updated regularly

## 💡 Ideas for Enhancement

- Add blog section (uses GitHub Discussions)
- Integrate with API for dynamic content
- Add dark mode animations
- Email notifications for contact form
- Social media feed integration
- Project showcase with demos
- Skills endorsement system
- Achievement badges

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

## 🤝 Support

For issues or questions:
1. Check troubleshooting section
2. Review browser console for errors
3. Check GitHub API status
4. Ensure all files are in correct locations

## 🎉 You're Ready!

Your DNYF TETCH website is fully configured and ready to deploy. 

**Next steps:**
1. Update GitHub username to yours
2. Customize colors and content
3. Deploy to your chosen platform
4. Share with the world! 🚀

---

**Built with:** HTML, CSS, JavaScript, GitHub API, Chart.js, Font Awesome
**Deployed on:** [Choose your platform]
**Version:** 1.0.0
