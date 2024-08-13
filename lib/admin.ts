import { auth } from '@clerk/nextjs'

const adminIds = ['user_2embwCfOgudbzPALK5LGON08zp2']

export const isAdmin = () => {
	const { userId } = auth()

	if (!userId) {
		return false
	}

	return adminIds.indexOf(userId) !== -1
}
