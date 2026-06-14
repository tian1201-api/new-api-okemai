package model

import (
	"sync"

	"github.com/QuantumNous/new-api/common"
	"github.com/shopspring/decimal"
)

var defaultSubscriptionPlanSeedMu sync.Mutex

func subscriptionQuotaFromUSD(usd int64) int64 {
	if usd <= 0 {
		return 0
	}
	if common.QuotaPerUnit <= 0 {
		return usd
	}
	return decimal.NewFromInt(usd).Mul(decimal.NewFromFloat(common.QuotaPerUnit)).Ceil().IntPart()
}

func defaultSubscriptionPlans() []SubscriptionPlan {
	return []SubscriptionPlan{
		{
			Title:             "月卡",
			Subtitle:          "适合个人日常使用，包含 100 美元订阅额度",
			PriceAmount:       29,
			Currency:          "USD",
			DurationUnit:      SubscriptionDurationMonth,
			DurationValue:     1,
			Enabled:           true,
			SortOrder:         40,
			AllowBalancePay:   common.GetPointer(true),
			TotalAmount:       subscriptionQuotaFromUSD(100),
			QuotaResetPeriod:  SubscriptionResetNever,
			MaxPurchasePerUser: 0,
		},
		{
			Title:             "季卡",
			Subtitle:          "适合稳定项目使用，包含 350 美元订阅额度",
			PriceAmount:       79,
			Currency:          "USD",
			DurationUnit:      SubscriptionDurationMonth,
			DurationValue:     3,
			Enabled:           true,
			SortOrder:         30,
			AllowBalancePay:   common.GetPointer(true),
			TotalAmount:       subscriptionQuotaFromUSD(350),
			QuotaResetPeriod:  SubscriptionResetNever,
			MaxPurchasePerUser: 0,
		},
		{
			Title:             "年卡",
			Subtitle:          "适合长期业务使用，包含 1500 美元订阅额度",
			PriceAmount:       299,
			Currency:          "USD",
			DurationUnit:      SubscriptionDurationYear,
			DurationValue:     1,
			Enabled:           true,
			SortOrder:         20,
			AllowBalancePay:   common.GetPointer(true),
			TotalAmount:       subscriptionQuotaFromUSD(1500),
			QuotaResetPeriod:  SubscriptionResetNever,
			MaxPurchasePerUser: 0,
		},
		{
			Title:             "企业版",
			Subtitle:          "适合团队和企业场景，后台可配置专属价格、额度和分组",
			PriceAmount:       999,
			Currency:          "USD",
			DurationUnit:      SubscriptionDurationYear,
			DurationValue:     1,
			Enabled:           true,
			SortOrder:         10,
			AllowBalancePay:   common.GetPointer(true),
			TotalAmount:       0,
			QuotaResetPeriod:  SubscriptionResetNever,
			MaxPurchasePerUser: 0,
		},
	}
}

func EnsureDefaultSubscriptionPlans() error {
	defaultSubscriptionPlanSeedMu.Lock()
	defer defaultSubscriptionPlanSeedMu.Unlock()

	var count int64
	if err := DB.Model(&SubscriptionPlan{}).Count(&count).Error; err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	plans := defaultSubscriptionPlans()
	for i := range plans {
		plans[i].NormalizeDefaults()
		if err := DB.Create(&plans[i]).Error; err != nil {
			return err
		}
	}
	_ = getSubscriptionPlanInfoCache().Purge()
	return nil
}

func ListSubscriptionPlans(enabledOnly bool) ([]SubscriptionPlan, error) {
	if err := EnsureDefaultSubscriptionPlans(); err != nil {
		return nil, err
	}
	query := DB.Order("sort_order desc, id desc")
	if enabledOnly {
		query = query.Where("enabled = ?", true)
	}
	var plans []SubscriptionPlan
	if err := query.Find(&plans).Error; err != nil {
		return nil, err
	}
	for i := range plans {
		plans[i].NormalizeDefaults()
	}
	return plans, nil
}
