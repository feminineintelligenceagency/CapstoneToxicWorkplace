# Scenario Manager & Asset System

## Overview

The Scenario Manager and Asset System allows users to:
- **Edit scenario data** (descriptions, roles, guidelines)
- **Upload assets** (images, videos, documents) to the Supabase S3 endpoint
- **Display assets** during the roleplay phase for visual context
- **Collaborative asset selection** - any player can select what to display

## Accessing the Scenario Manager

1. Navigate to the home page (`/`)
2. Find the **Toxic Workplace** game card
3. Hover over the card to reveal a ⚙️ **Settings** button in the top-left corner
4. Click the Settings button to open the Scenario Editor modal

## Features

### Scenario Editor Tab

- **Select Scenario**: Choose from available scenarios (currently the base scenarios)
- **View Scenario Details**: 
  - Company name
  - Scenario seed
  - Description (editable)
  - List of roles with guidelines
- **Edit Description**: Modify the scenario description for custom variations

**Note**: In this implementation, edits are local only and won't persist to the database without additional backend integration.

### Assets & Media Tab

- **Upload Files**: Upload images, videos, or documents
  - Supported formats: JPG, PNG, GIF, WebP, MP4, WebM, MOV, PDF, DOC, DOCX
  - Files are uploaded to Supabase S3 storage
  - Each scenario has its own storage folder

- **View Uploaded Assets**: See all assets for the current scenario
  - Shows file type and upload timestamp
  - Click to preview or manage assets

## During Roleplay Phase

### Asset Selection

Players can display assets during the roleplay phase:

1. **Select Asset Button**: Click "Select Asset" in the asset display area
2. **Preview**: See all available assets for the scenario
3. **Choose & Display**: Click an asset to display it to all players
4. **Remove Asset**: Click "Remove" to hide the currently displayed asset

### Permission Model

- **No restrictions**: Any player can select, change, or remove displayed assets
- **Player responsibility**: Players are expected to respect who is "presenting"
- **Self-regulated**: The group decides who controls the display at any time

### Asset Display Types

- **Images**: Full preview displayed in the roleplay area
- **Videos**: Embedded video player with controls
- **Documents**: Link to open in new tab (preview not available inline)

## S3 Integration (Supabase Storage)

**Upload Method**: Direct client-side upload to Supabase Storage (no backend server required)

### Upload Flow

1. **Frontend**: User selects file in ScenarioEditor
2. **Direct Upload**: File uploaded directly to Supabase Storage bucket "assets"
3. **Automatic URL**: Public URL returned for displaying in-game
4. **No Backend Calls**: All handled client-side with Supabase SDK

### Required Setup

Create a Supabase Storage bucket:

1. Go to **Supabase Dashboard** → Your Project
2. Click **Storage** (left sidebar)
3. Click **Create a new bucket**
4. Name it: **assets** (lowercase, exactly)
5. Check **Public** (to allow public access)
6. Create bucket

That's it! No environment variables needed beyond what you already have.

### File Storage Structure

```
assets/
├── scenario-0/
│   ├── 2024-02-23T10:30:00.000Z-slide1.jpg
│   ├── 2024-02-23T10:31:00.000Z-video.mp4
│   └── 2024-02-23T10:32:00.000Z-whiteboard.jpeg
├── scenario-1/
│   └── ...
└── scenario-2/
    └── ...
```

### Troubleshooting

**"Bucket not found" error:**
- Verify bucket name is exactly **"assets"** (case-sensitive)
- Check the bucket is marked as **Public**
- Refresh and try again
- Check your Supabase project is the correct one

## Component Architecture

### ScenarioEditor Component

Main dialog component for managing scenarios and assets.

**Props**:
- `isOpen: boolean` - Dialog visibility
- `onClose: () => void` - Close handler

### AssetSelector Component

Modal for selecting assets to display during roleplay.

**Props**:
- `isOpen: boolean` - Dialog visibility
- `onClose: () => void` - Close handler
- `availableAssets: Asset[]` - List of assets to choose from
- `onSelectAsset?: (asset: Asset) => void` - Selection callback
- `selectedAssetUrl?: string` - Currently selected asset URL

### useS3Upload Hook

Custom hook for handling Supabase Storage uploads.

**Methods**:
- `uploadFile(file, path)` - Upload file to Supabase Storage (returns public URL)

**Properties**:
- `uploading: boolean` - Upload in progress
- `progress: UploadProgress | null` - Upload progress
- `error: string | null` - Error message

## Types

### DisplayedAsset

```typescript
interface DisplayedAsset {
  url: string;
  name: string;
  type: 'image' | 'video' | 'document';
  presentedBy: string; // player ID
  presentedAt: string; // ISO timestamp
}
```

### Asset

```typescript
interface Asset {
  type: 'image' | 'video' | 'document';
  name: string;
  url: string;
}
```

## Future Enhancements

1. **Persistent Storage**: Save edited scenarios to database
2. **Asset Library**: Shared asset library across all scenarios
3. **User Permissions**: Restrict asset uploads to certain roles/players
4. **Custom Scenarios**: Allow users to create entirely new scenarios
5. **Asset Tagging**: Tag and organize assets for easier discovery
6. **Presentation Mode**: Formal presentation controls with speaker notes
7. **Asset Timeline**: Track when assets were shown and for how long

## Troubleshooting

### "Bucket not found" Upload Error

1. **Check bucket exists**: Supabase Dashboard → Storage → "assets" bucket visible?
2. **Verify bucket name**: Must be exactly **"assets"** (lowercase)
3. **Check bucket is Public**: Click bucket → Settings → make sure Public toggle is ON
4. **Refresh browser**: Clear cache and reload app
5. **Check project**: Make sure you're in the right Supabase project

### Upload Still Fails

- Check browser console (F12) for specific error messages
- Verify file is under 100MB
- Try a small image file (JPG, PNG) first to test

### Assets Not Displaying During Roleplay

- Verify the file uploaded successfully (check Storage in Supabase Dashboard)
- Make sure bucket is Public
- Try refreshing the page
- Check browser console for any errors

### Missing Images in Preview

- Bucket must be marked as **Public** in Supabase
- Check file format is supported (JPG, PNG, GIF, WebP, MP4, WebM)
- Verify the URL works by opening it directly in browser

## Legal & Usage

- Users are responsible for uploading only assets they have rights to
- Ensure compliance with copyright and licensing requirements
- Assets are stored on Supabase's infrastructure

---

**Last Updated**: February 2025 | **Backend Required**: No | **Client-Side Upload**: Yes

