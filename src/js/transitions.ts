// import barba from '@barba/core'
// import gsap from 'gsap'

// export const init = () => {
//   let wrapper: any

//   barba.hooks.enter(() => {
//     window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
//   })

//   barba.init({
//     transitions: [
//       {
//         name: 'opacity-transition',
//         leave: ({ current }) => gsap.to(current.container, { opacity: 0 }),
//         enter(data) {
//           wrapper = [...document.querySelectorAll("[data-barba='container']")]
//           wrapper.forEach(el => el.classList.add('body-is-fixed'))

//           return gsap.from(data.next.container, {
//             opacity: 0
//           })
//         },
//         after: () => wrapper.forEach(el => el.classList.remove('body-is-fixed'))
//       }
//     ]
//   })
// }
