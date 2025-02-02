const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const admin = require('./modules/admin')
const passport = require('../config/passport')
const upload = require('../middleware/multer')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// 後台管理員
router.use('/admin', authenticatedAdmin, admin)

// 使用者註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// 使用者登入登出
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureMessage: true }), userController.signIn)
router.get('/signout', userController.signout)

// 使用者瀏覽最新動態(/feed也符合/:id的路由，因此置於前)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)

// 使用者瀏覽人氣餐廳(同上備註)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)

// 使用者查看單筆資料
router.get('/restaurants/:id/dashboard', restController.getDashboard)
router.get('/restaurants/:id', restController.getRestaurant)

// 使用者登入後餐廳首頁
router.get('/restaurants', authenticated, restController.getRestaurants)

// 管理員(限定)刪除評論
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

// 使用者新增評論
router.post('/comments', authenticated, commentController.postComment)

// 使用者收藏餐廳
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// 使用者喜歡餐廳
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// 使用者瀏覽美食達人
router.get('/users/top', authenticated, userController.getTopUsers)

// 使用者編輯個人資訊
router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

// 使用者追蹤美食達人
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

// 當所有路由都不符合時自動導向餐廳首頁
router.use('', (req, res) => res.redirect('/restaurants'))

// 錯誤訊息處理
router.use('/', generalErrorHandler)

module.exports = router
