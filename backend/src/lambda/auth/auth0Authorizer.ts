import {CustomAuthorizerEvent, CustomAuthorizerResult} from 'aws-lambda'
import 'source-map-support/register'

import {decode, verify} from 'jsonwebtoken'
import {createLogger} from '../../utils/logger'
import Axios from 'axios'
import {Jwt} from '../../auth/Jwt'
import {JwtPayload} from '../../auth/JwtPayload'

const logger = createLogger('auth')
const jwksUrl = 'https://dev-ucm--6lu.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  logger.info('Authorizing TOKEN: '+ token)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  const response = await Axios.get(jwksUrl);
  // @ts-ignore
  const signingKey = response.data.keys.find(key => key.kid === jwt.header.kid);
  let certValue:string = signingKey.x5c[0];

  certValue = certValue.match(/.{1,64}/g).join('\n');
  const finalCertKey:string = `-----BEGIN CERTIFICATE-----\n${certValue}\n-----END CERTIFICATE-----\n`;

 return verify(token, finalCertKey, {algorithms: ['RS256']}) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  return split[1]
}
