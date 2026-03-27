# Google Cloud Storage Environment Setup for API

## Environment Variables

Add the following variables to your `.env` file in the `api` directory:

```bash
# Google Cloud Storage Configuration
GCS_PROJECT_ID=plated-reducer-475908-u2
GCS_BUCKET_NAME=your-bucket-name-here
GCS_KEY_FILE_PATH=./gcs-service-account.json

# Alternative: Use service account JSON directly (for containerized deployments)
# GOOGLE_APPLICATION_CREDENTIALS=./gcs-service-account.json
```

## Configuration Details

### GCS_PROJECT_ID
- **Purpose**: Your Google Cloud Project ID
- **Value**: `plated-reducer-475908-u2` (from your service account)
- **Required**: Yes

### GCS_BUCKET_NAME
- **Purpose**: Name of your Google Cloud Storage bucket
- **Format**: `your-bucket-name-here`
- **Example**: `my-app-uploads`, `residential-management-files`
- **Required**: Yes

### GCS_KEY_FILE_PATH
- **Purpose**: Path to your service account key file
- **Format**: `./gcs-service-account.json` (relative to API directory)
- **Required**: Yes (unless using GOOGLE_APPLICATION_CREDENTIALS)

## Service Account Key File

The service account key file (`gcs-service-account.json`) has been created with your provided credentials. This file contains:

- **Project ID**: `plated-reducer-475908-u2`
- **Service Account Email**: `storage-access@plated-reducer-475908-u2.iam.gserviceaccount.com`
- **Private Key**: For authentication with Google Cloud Storage

## Migration from AWS S3

If you're migrating from AWS S3, replace these environment variables:

**Before (S3):**
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET_NAME=your-bucket-name
```

**After (GCS):**
```bash
GCS_PROJECT_ID=plated-reducer-475908-u2
GCS_BUCKET_NAME=your-bucket-name-here
GCS_KEY_FILE_PATH=./gcs-service-account.json
```

## Testing the Configuration

1. **Install dependencies**:
   ```bash
   cd api
   npm install
   ```

2. **Start the API server**:
   ```bash
   npm run start:dev
   ```

3. **Check for errors**: Look for any GCS-related error messages in the console

4. **Test file upload**: Try uploading an image through your application

## Troubleshooting

### Common Issues

1. **"GCS project ID not configured"**
   - Check that `GCS_PROJECT_ID` is set correctly
   - Verify the project ID matches your service account

2. **"GCS bucket not configured"**
   - Check that `GCS_BUCKET_NAME` is set
   - Verify the bucket name is correct

3. **"Authentication Error"**
   - Check that `GCS_KEY_FILE_PATH` points to the correct file
   - Verify the service account key file is valid
   - Ensure the service account has proper permissions

4. **"Bucket Not Found"**
   - Verify the bucket exists in your Google Cloud project
   - Check that the service account has access to the bucket

### Debug Steps

1. **Check environment variables**:
   ```bash
   echo $GCS_PROJECT_ID
   echo $GCS_BUCKET_NAME
   echo $GCS_KEY_FILE_PATH
   ```

2. **Verify service account key file**:
   ```bash
   cat gcs-service-account.json | jq '.project_id'
   ```

3. **Test GCS connection**:
   ```bash
   gcloud auth application-default print-access-token
   ```

## Security Best Practices

1. **Never commit credentials**: Add `gcs-service-account.json` to `.gitignore`
2. **Use environment variables**: For production, use environment variables instead of key files
3. **Rotate keys**: Regularly rotate service account keys
4. **Least privilege**: Only grant necessary GCS permissions

## Production Deployment

For production deployment:

1. **Use environment variables** instead of key files
2. **Set up Workload Identity** for Google Kubernetes Engine
3. **Configure proper IAM roles** for your service account
4. **Enable audit logging** for security monitoring

## File Structure

After setup, your API directory should have:

```
api/
├── gcs-service-account.json  # Service account key file
├── .env                      # Environment variables
├── src/
│   └── modules/
│       └── shared/
│           ├── gcs/          # GCS service and module
│           └── s3/           # Old S3 service (can be removed)
└── ...
```

---

After completing this setup, your API should be able to upload and manage files using Google Cloud Storage instead of AWS S3.
