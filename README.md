# Collected Remix

This repo is a [Collected Notes](https://collectednotes.com) client app built using Remix.

The app also uses Remix i18next and Remix Auth packages to support internationalization and authentication. It also has ETag support already built-in. It uses NProgress to show a progress bar on navigation, and uses Tailwind for styles.

The app consumes the Collected Notes API, and it also shows a few features of Remix:

- Loaders, Meta and Links
- Form and Actions for login/logout
- Sessions
- Cookies
- Layout Routes
- Catch and Error Boundaries to show error pages
- <Link prefetch />
- Cache Control values for loaders based on the data (articles not updated in a while are cached for a longer time)

The app is configured to deploy to Vercel, but could be deployed anywhere else.
