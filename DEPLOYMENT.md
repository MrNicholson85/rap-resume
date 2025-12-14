# Deploying to Vercel

This guide will help you deploy your Rap Resume app to Vercel.

## Prerequisites

- GitHub account (recommended) or GitLab/Bitbucket
- Vercel account (free) - [Sign up here](https://vercel.com/signup)
- Your Spotify API credentials

## Step 1: Push Your Code to GitHub

1. Create a new repository on [GitHub](https://github.com/new)
2. In your project directory, run:

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rap-resume.git
git push -u origin main
```

## Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `rap-resume` repository
5. Click **"Import"**

## Step 3: Configure Environment Variables

**IMPORTANT:** Before deploying, add your Spotify credentials:

1. In the project configuration screen, scroll to **"Environment Variables"**
2. Add the following variables:
   - **Name:** `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`
   - **Value:** Your Spotify Client ID
   - Click **"Add"**
   
   - **Name:** `NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET`
   - **Value:** Your Spotify Client Secret
   - Click **"Add"**

3. Make sure these are added to all environments (Production, Preview, Development)

## Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Once deployed, Vercel will provide you with a URL (e.g., `rap-resume.vercel.app`)

## Step 5: Test Your Deployment

1. Visit your deployment URL
2. Test the artist search functionality
3. Verify streaming links work on album pages

## Updating Your Deployment

Every time you push changes to your GitHub repository, Vercel will automatically rebuild and redeploy your app.

```bash
git add .
git commit -m "Your update message"
git push
```

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to **"Domains"**
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS

## Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### API Errors
- Double-check your Spotify credentials in environment variables
- Make sure there are no extra spaces in the values
- Verify your Spotify app settings allow the Vercel domain

### Images Not Loading
- Ensure `next.config.ts` has the correct image domains configured
- Check browser console for CORS or image loading errors

## Environment Variables Reference

```
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

## Security Notes

- Never commit `.env.local` to your repository
- Environment variables in Vercel are encrypted and secure
- Vercel automatically secures your deployment with HTTPS
- Your Spotify credentials are only accessible during build/runtime

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Spotify API Status](https://developer.spotify.com/status)
