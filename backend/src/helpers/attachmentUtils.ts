import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

// @ts-ignore
const XAWS = AWSXRay.captureAWS(AWS)
