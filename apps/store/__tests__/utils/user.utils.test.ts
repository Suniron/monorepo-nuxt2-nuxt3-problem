import type { user as User } from '@prisma/client'
import { sanitizeUser } from '../../src/utils/user.utils'

describe('sanitizeUser', () => {
  it('should return a sanitized user', () => {
    const user: User = {
      company_id: 1,
      email: 'etienne@x-rator.com',
      first_name: 'Etienne',
      id: '1a3f30d8-a8fb-4f93-be14-5ba55edzefezfez',
      is_two_factor_required: false,
      last_name: 'Blanc',
      password: 'myHashedPassword',
      reset_token: 'myResetToken',
      roles: [
        'admin',
      ],
      salt: 'mySalt',
      token_expires_at: '1671640803114',
      two_factor_confirmed_at: new Date(),
      two_factor_secret: 'mySecret',
      username: 'etienne',
    }

    const sanitizedUser = sanitizeUser(user)

    expect(sanitizedUser).toEqual({
      companyId: 1,
      email: 'etienne@x-rator.com',
      firstName: 'Etienne',
      id: '1a3f30d8-a8fb-4f93-be14-5ba55edzefezfez',
      lastName: 'Blanc',
      roles: [
        'admin',
      ],
      username: 'etienne',
    })
  })
})
