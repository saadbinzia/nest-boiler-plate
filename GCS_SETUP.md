# Google Cloud Storage Configuration Guide

This guide will help you set up Google Cloud Storage (GCS) for file uploads in the residential management system.

## Prerequisites

1. Google Cloud Platform Account
2. Google Cloud SDK installed (optional but recommended)
3. Access to your project's `.env` file

## Step 1: Create Google Cloud Storage Bucket

### Option A: Using Google Cloud Console

1. **Login to Google Cloud Console**: Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Navigate to Cloud Storage**: Search for "Cloud Storage" in the services menu
3. **Create Bucket**:
   - Click "Create bucket"
   - Choose a unique bucket name (e.g., `your-app-name-uploads`)
   - Select your preferred location (e.g., `us-central1`)
   - **Access Control**: Choose "Uniform" for better security
   - **Protection Tools**: Enable as needed
   - Click "Create"

### Option B: Using Google Cloud CLI

```bash
# Create bucket
gsutil mb gs://your-app-name-uploads

# Set bucket permissions (optional - for public read access)
gsutil iam ch allUsers:objectViewer gs://your-app-name-uploads
```

## Step 2: Create Service Account for GCS Access

### Using Google Cloud Console

1. **Navigate to IAM & Admin**: Go to IAM & Admin service in Google Cloud Console
2. **Create Service Account**:
   - Click "Service Accounts" → "Create Service Account"
   - Service account name: `your-app-gcs-service`
   - Description: "Service account for GCS file operations"
   - Click "Create and Continue"

3. **Set Permissions**:
   - Role: `Storage Admin` (or create custom role below)
   - Click "Continue" → "Done"

4. **Create and Download Key**:
   - Click on the created service account
   - Go to "Keys" tab → "Add Key" → "Create new key"
   - Choose "JSON" format
   - Download the JSON key file
   - **IMPORTANT**: Keep this file secure and never commit it to version control!

### Custom GCS Policy (Recommended for Production)

Instead of `Storage Admin`, create a custom role with minimal permissions:

```json
{
  "title": "Custom Storage Role",
  "description": "Custom role for application storage operations",
  "stage": "GA",
  "includedPermissions": [
    "storage.objects.create",
    "storage.objects.delete",
    "storage.objects.get",
    "storage.objects.list",
    "storage.buckets.get"
  ]
}
```

## Step 3: Configure Environment Variables

### Backend Configuration

Add the following variables to your `.env` file:

```bash
# Google Cloud Storage Configuration
GCS_PROJECT_ID=plated-reducer-475908-u2
GCS_BUCKET_NAME=your-app-name-uploads
GCS_KEY_FILE_PATH=/path/to/your/service-account-key.json

# Alternative: Use service account JSON directly (for containerized deployments)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
```

### For Frontend (.env in admin folder)

```bash
# GCS Base URL for frontend
VITE_GCS_BASE_URL=https://storage.googleapis.com/your-app-name-uploads
```

## Step 4: Service Account Key Setup

### Option A: Service Account Key File

1. **Save the JSON key file** to a secure location (e.g., `./config/gcs-key.json`)
2. **Set the path** in your environment variables:
   ```bash
   GCS_KEY_FILE_PATH=./config/gcs-key.json
   ```

### Option B: Environment Variables (for containerized deployments)

Set the service account JSON as an environment variable:

```bash
export GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account","project_id":"plated-reducer-475908-u2",...}'
```

## Step 5: Test the Configuration

### Backend Test

1. **Install dependencies**:
   ```bash
   cd api
   npm install
   ```

2. **Restart your API server**:
   ```bash
   npm run start:dev
   ```

3. **Check for errors**: Look for any GCS-related error messages in the console

4. **Test file upload**: Try uploading an image through your application

### Frontend Test

1. **Update frontend environment**:
   ```bash
   cd admin
   # Make sure VITE_GCS_BASE_URL is set correctly
   npm run dev
   ```

2. **Test image upload**: Try uploading an image in the building/floor/space forms

## Step 6: Configure CORS (if needed)

If you're accessing GCS directly from the frontend, configure CORS:

### GCS Bucket CORS Configuration

```json
[
  {
    "origin": [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://your-production-domain.com"
    ],
    "method": ["GET", "PUT", "POST", "DELETE"],
    "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
  }
]
```

Apply CORS configuration:
```bash
gsutil cors set cors-config.json gs://your-app-name-uploads
```

## Troubleshooting

### Common Issues

1. **"Authentication Error"**
   - Check that `GCS_PROJECT_ID` is set correctly
   - Verify the service account key file path
   - Ensure the service account has proper permissions

2. **"Bucket Not Found"**
   - Verify bucket name in environment variables
   - Check that bucket exists in the specified project
   - Ensure the service account has access to the bucket

3. **"Permission Denied"**
   - Check service account permissions
   - Verify bucket IAM policies
   - Ensure the service account has Storage Admin or custom role

4. **"Invalid Credentials"**
   - Verify the service account key file is valid JSON
   - Check that the key file hasn't expired
   - Ensure the service account is active

### Debug Commands

```bash
# Test GCS credentials
gcloud auth application-default print-access-token

# List GCS buckets
gsutil ls

# Test bucket access
gsutil ls gs://your-app-name-uploads

# Check service account permissions
gcloud projects get-iam-policy plated-reducer-475908-u2
```

## Security Best Practices

1. **Use Service Accounts**: Never use user credentials in production
2. **Least Privilege**: Only grant necessary GCS permissions
3. **Rotate Keys**: Regularly rotate service account keys
4. **Environment Variables**: Never commit credentials to version control
5. **Bucket Policies**: Use bucket IAM policies to restrict access
6. **Enable Logging**: Enable Cloud Storage access logging for audit trails

## Production Deployment

### Using Workload Identity (Recommended for GKE)

For production deployments on Google Kubernetes Engine:

1. Create a service account with GCS permissions
2. Configure Workload Identity to bind the service account to your pods
3. Remove `GCS_KEY_FILE_PATH` from production environment
4. GCS client will automatically use Workload Identity credentials

### Environment-Specific Configuration

```bash
# Development
GCS_BUCKET_NAME=your-app-dev-uploads

# Staging
GCS_BUCKET_NAME=your-app-staging-uploads

# Production
GCS_BUCKET_NAME=your-app-prod-uploads
```

## Cost Optimization

1. **Lifecycle Policies**: Set up lifecycle policies to move old files to cheaper storage classes
2. **Nearline/Coldline Storage**: Use appropriate storage classes for different file types
3. **Monitor Usage**: Use Google Cloud Console to monitor GCS costs
4. **Delete Unused Files**: Implement cleanup processes for temporary files

## Migration from AWS S3

If migrating from AWS S3:

1. **Update environment variables** from AWS to GCS format
2. **Replace S3Service with GCSService** in your modules
3. **Update file URLs** from S3 format to GCS format
4. **Test file operations** to ensure compatibility

---

After completing this setup, your image upload functionality should work properly with Google Cloud Storage. If you continue to have issues, check the application logs for specific error messages.
