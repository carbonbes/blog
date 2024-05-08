export async function signIn(body: {
  email: string
  name: string
  avatar?: string
}) {
  return await $fetch('/api/v1/auth/signin', {
    method: 'POST',
    body,
  })
}
