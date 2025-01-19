WITH ProductCosts AS (
    SELECT 
        ci.cartId,
        ci.productId,
        p.price,
        ci.quantity,
        COALESCE(
            CASE 
                WHEN d.discount_type = 'percent' THEN p.price * (1 - d.discount_value/100)
                WHEN d.discount_type = 'fixed' THEN p.price - d.discount_value
                ELSE p.price
            END, 
            p.price
        ) AS final_price,
        (COALESCE(
            CASE 
                WHEN d.discount_type = 'percent' THEN p.price * (1 - d.discount_value/100)
                WHEN d.discount_type = 'fixed' THEN p.price - d.discount_value
                ELSE p.price
            END, 
            p.price
        ) * ci.quantity) AS product_total
    FROM 
        cart_item ci
    JOIN 
        product p ON ci.productId = p.id
    LEFT JOIN 
        product_discount pd ON ci.productId = pd.productId
    LEFT JOIN 
        discount d ON pd.discountId = d.id
    WHERE 
        ci.cartId = (
            SELECT c.id
            FROM cart c
            WHERE c.customerId = <current_customer_id>
        )
),
CartTotal AS (
    SELECT 
        cartId,
        SUM(product_total) AS total_products_value
    FROM 
        ProductCosts
    GROUP BY 
        cartId
),
CouponDiscount AS (
    SELECT 
        c.cartId,
        COALESCE(
            CASE 
                WHEN cu.discount_type = 'percent' THEN ct.total_products_value * cu.discount_value/100
                WHEN cu.discount_type = 'fixed' THEN cu.discount_value
                ELSE 0
            END, 
            0
        ) AS coupon_discount
    FROM 
        cart c
    JOIN 
        CartTotal ct ON c.id = ct.cartId
    LEFT JOIN 
        coupons cu ON c.coupon_code = cu.code
    WHERE 
        c.coupon_code = <coupon_code> -- coupon_code berilgan qiymat
),
FinalAmount AS (
    SELECT 
        ct.cartId,
        ct.total_products_value - cd.coupon_discount AS adjusted_total,
        ip.interest_rate
    FROM 
        CartTotal ct
    LEFT JOIN 
        CouponDiscount cd ON ct.cartId = cd.cartId
    JOIN 
        installment_plans ip ON ip.id = <plan_id>
)
SELECT 
    fa.cartId,
    fa.adjusted_total + (fa.adjusted_total * fa.interest_rate/100) - <down_payment> AS total_amount
FROM 
    FinalAmount fa
JOIN 
    cart c ON fa.cartId = c.id
JOIN 
    contract ct ON c.customerId = ct.customerId;
