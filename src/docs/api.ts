/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - roleId
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *         roleId:
 *           type: integer
 *           example: 3
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             expiresIn:
 *               type: string
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - itemId
 *               - quantity
 *             properties:
 *               itemId:
 *                 type: integer
 *                 description: ID of the item to order.
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the item.
 *                 example: 2
 *           description: List of items to include in the order.
 *         waiter_id:
 *           type: integer
 *           nullable: true
 *           description: Optional ID of the waiter assisting with the order.
 *           example: 2
 *
 *     UpdateOrderRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, processing, completed, cancelled, refunded]
 *           description: New status for the order.
 *           example: "processing"
 *         waiter_id:
 *           type: integer
 *           nullable: true
 *           description: New waiter ID to assign to the order.
 *           example: 3
 *
 *     AddItemToOrderRequest:
 *       type: object
 *       required:
 *         - itemId
 *         - quantity
 *       properties:
 *         itemId:
 *           type: integer
 *           description: ID of the item to add.
 *           example: 3
 *         quantity:
 *           type: integer
 *           description: Quantity of the item to add.
 *           example: 1
 *
 *     OrderResponse:
 *       $ref: '#/components/schemas/Order'
 *
 *     OrdersResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 *         total:
 *           type: integer
 *           example: 50
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         totalPages:
 *           type: integer
 *           example: 5
 *
 *     CreateItemRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category_id
 *         - expiry_date
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *           example: "New Widget"
 *         description:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: "A very useful widget."
 *         price:
 *           type: number
 *           format: float
 *           positive: true
 *           example: 19.99
 *         category_id:
 *           type: integer
 *           positive: true
 *           example: 1
 *         expiry_date:
 *           type: string
 *           format: date-time # Assuming ISO 8601 based on validation
 *           nullable: true
 *           example: "2027-01-01T00:00:00Z"
 *         stock_qty:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           example: 100
 *         is_active:
 *           type: boolean
 *           default: true
 *           example: true
 *
 *     UpdateItemRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *           example: "Updated Widget"
 *         description:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *           example: "An even more useful widget."
 *         price:
 *           type: number
 *           format: float
 *           positive: true
 *           example: 29.99
 *         category_id:
 *           type: integer
 *           positive: true
 *           example: 2
 *         expiry_date:
 *           type: string
 *           format: date-time # Assuming ISO 8601
 *           nullable: true
 *           example: "2028-01-01T00:00:00Z"
 *         stock_qty:
 *           type: integer
 *           minimum: 0
 *           example: 150
 *         is_active:
 *           type: boolean
 *           example: false
 *
 *     ItemResponse:
 *       $ref: '#/components/schemas/Item'
 *
 *     ItemsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Item'
 *         total:
 *           type: integer
 *           example: 100
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         totalPages:
 *           type: integer
 *           example: 10
 *
 *     CheckAvailabilityResponse:
 *       type: object
 *       properties:
 *         itemId:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 5
 *         available:
 *           type: boolean
 *           example: true
 *
 *     ExpiringItemsResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Item'
 *         daysAhead:
 *           type: integer
 *           example: 5
 *
 *     CommissionReportQuery:
 *       type: object
 *       properties:
 *         waiterName:
 *           type: string
 *           description: Name of the waiter to generate the report for.
 *           example: "John Doe"
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date for the report period (YYYY-MM-DD).
 *           example: "2025-01-01"
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date for the report period (YYYY-MM-DD).
 *           example: "2025-01-31"
 *         format:
 *           type: string
 *           enum: [json, csv, pdf]
 *           default: json
 *           description: Desired format for the report.
 *
 *     WaiterCommissionReport: # More detailed than IWaiterCommissionReport
 *       type: object
 *       properties:
 *         waiterId:
 *           type: integer
 *           example: 1
 *         waiterName:
 *           type: string
 *           example: "John Doe"
 *         period:
 *           type: string
 *           example: "2025-01-01 to 2025-01-31"
 *         totalOrders:
 *           type: integer
 *           example: 50
 *         totalSales:
 *           type: number
 *           format: float
 *           example: 2500.75
 *         commissionRate:
 *           type: number
 *           format: float
 *           example: 0.05 # 5%
 *         totalCommission:
 *           type: number
 *           format: float
 *           example: 125.04
 *         orders: # Optional: could be a summary or detailed list
 *           type: array
 *           items:
 *             type: object # Simplified order details for the report
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 101
 *               orderDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-15T10:30:00Z"
 *               orderTotal:
 *                 type: number
 *                 format: float
 *                 example: 75.50
 *               commissionEarned:
 *                 type: number
 *                 format: float
 *                 example: 3.78
 *
 *     CommissionReportResponse: # For JSON format
 *       $ref: '#/components/schemas/WaiterCommissionReport'
 *
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid token
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "🎉 API is up and running"
 */

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Item management
 */

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateItemRequest'
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemResponse'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have admin role)
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, stock_qty, expiry_date, created_at]
 *           default: created_at
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter string (e.g., name:Laptop,category_id:1)
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemsResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get an item by ID
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The item ID
 *     responses:
 *       200:
 *         description: Item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have staff role)
 *       404:
 *         description: Item not found
 *   put:
 *     summary: Update an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateItemRequest'
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemResponse'
 *       400:
 *         description: Invalid request body or ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have admin role)
 *       404:
 *         description: Item not found
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The item ID
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have admin role)
 *       404:
 *         description: Item not found
 */

/**
 * @swagger
 * /items/{id}/availability:
 *   get:
 *     summary: Check item availability
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The item ID
 *       - in: query
 *         name: quantity
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Quantity to check
 *     responses:
 *       200:
 *         description: Availability status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckAvailabilityResponse'
 *       400:
 *         description: Invalid quantity or item ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have staff role)
 *       404:
 *         description: Item not found
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have cashier role)
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of orders per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Field to sort by (e.g., total_cost, created_at)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, cancelled, refunded]
 *         description: Filter by order status
 *       - in: query
 *         name: cashierId
 *         schema:
 *           type: integer
 *         description: Filter by cashier ID
 *       - in: query
 *         name: waiterId
 *         schema:
 *           type: integer
 *         description: Filter by waiter ID
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdersResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have admin role)
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have staff role)
 *       404:
 *         description: Order not found
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderRequest'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Invalid request body or ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have staff role)
 *       404:
 *         description: Order not found
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have admin role)
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /orders/{id}/items:
 *   post:
 *     summary: Add an item to an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddItemToOrderRequest'
 *     responses:
 *       200:
 *         description: Item added to order successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Invalid request body or order ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have staff role)
 *       404:
 *         description: Order or item not found
 */

/**
 * @swagger
 * /orders/{orderId}/items/{itemId}:
 *   delete:
 *     summary: Remove an item from an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order ID
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The item ID to remove
 *     responses:
 *       200:
 *         description: Item removed from order successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have staff role)
 *       404:
 *         description: Order or item not found in order
 */

/**
 * @swagger
 * /orders/{id}/complete:
 *   patch:
 *     summary: Mark an order as complete
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order marked as complete
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have staff role)
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /orders/{orderId}/assign-waiter:
 *   patch:
 *     summary: Assign a waiter to an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - waiterId
 *             properties:
 *               waiterId:
 *                 type: integer
 *                 description: The ID of the waiter to assign
 *     responses:
 *       200:
 *         description: Waiter assigned to order successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Invalid waiter ID or order ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (User does not have staff role)
 *       404:
 *         description: Order or waiter not found
 */

/**
 * @swagger
 * tags:
 *   name: Commissions
 *   description: Commission report generation
 */

/**
 * @swagger
 * /commissions/waiter-report:
 *   get:
 *     summary: Get waiter commission report
 *     tags: [Commissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: waiterName
 *         schema:
 *           type: string
 *         description: Name of the waiter (Optional, if not provided, report for all waiters or current user if not admin)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the report (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the report (YYYY-MM-DD)
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, pdf]
 *           default: json
 *         description: Desired format for the report
 *     responses:
 *       200:
 *         description: Commission report generated successfully. Content type will vary based on format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommissionReportResponse' # For JSON
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 */
