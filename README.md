```
docker build -t my-proof .

docker run --rm --volume ${PWD}/demo/sealed:/sealed --volume ${PWD}/demo/input:/input --volume ${PWD}/demo/output:/output --env AWS_ACCESS_KEY_ID=your_aws_access_key_id --env AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key my-proof --env MONGO_URI=your_mongodb_uri

 $env:NODE_ENV="development"; $env:JWT_SECRET_KEY=""; $env:VALIDATOR_BASE_API_URL="" node main.js
```