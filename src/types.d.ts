declare interface User {
  username: string
  password: string
}

declare interface UserMeta {
  email: string
  firstName?: string
  lastName?: string
  urlHandle?: string
  profilePicture?: string
  dateOfBirth?: string
  gender?: string
  locale?: string
  timeZone?: string
  coverPicture?: string
  roles?: string[]
  businesses?: string[]
  tags?: string[]
  interests?: string[]
  profileBlocks?: ProfileBlock[]
  links?: Link[]
  onboardingComplete?: boolean
}

declare interface Message {
  message: string
  type: string
}

declare interface ProfileBlock {
  owner: string
  type: string
  created: string
  visibility: string
  content: string
  image?: string
  video?: string
  url?: string
  rcmd?: string
}

declare interface MyTest {
  foo: string
  bar: string
}

declare interface Link {
  id?: string
  owner: string
  title: string
  url: string
  description: string
  created: string
  updated: string
  visibility: string
}

declare interface Rcmd {
  id?: string
  owner: string
  image: string
  title: string
  description: string
  locationType: string
  address?: string
  tags?: string[]
  url: string
  discountCode?: string
  video?: string
  created: string
  updated: string
  visibility: string
}

declare interface Business {
  id?: string
  owner: string
}

declare interface ContentCreator {
  id?: string
  owner: string
}
