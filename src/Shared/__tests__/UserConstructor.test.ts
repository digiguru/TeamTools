import { describe, expect, it } from 'vitest'
import { UserConstructor } from '../UserConstructor'

describe('UserConstructor', () => {
  it('creates users with stable generated ids', () => {
    const users = UserConstructor.createUsersByNames(['Ada', 'Grace'])

    expect(users).toHaveLength(2)
    expect(users[0]).toMatchObject({ name: 'Ada', id: 'user0' })
    expect(users[1]).toMatchObject({ name: 'Grace', id: 'user1' })
  })

  it('ignores empty names', () => {
    const users = UserConstructor.createUsersByNames(['Ada', '', 'Grace'])

    expect(users).toHaveLength(2)
    expect(users.map((user) => user.name)).toEqual(['Ada', 'Grace'])
  })

  it('creates a single user from a name and index', () => {
    expect(UserConstructor.createUser('Linus', 4)).toMatchObject({
      name: 'Linus',
      id: 'user4',
    })
  })
})
