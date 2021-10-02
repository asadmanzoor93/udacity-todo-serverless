import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {createLogger} from '../utils/logger'

// @ts-ignore
const XAWS = AWSXRay.captureAWS(AWS)

// @ts-ignore
const logger = createLogger('TodosAccess')
