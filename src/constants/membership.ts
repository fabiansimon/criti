// Development
// export const MEMBERSHIPS = {
//   V1_MONTHLY: {
//     priceId: "price_1QD4NdEsfTIBY629s3bNIXuy",
//     name: "Pro Collaborator - Monthly",
//   },
//   V1_ANNUALLY: {
//     priceId: "price_1QD4NEEsfTIBY629O0JqZrWH",
//     name: "Pro Collaborator - Yearly",
//   },
// };

import { env } from "~/env";

// Production Products
export const MEMBERSHIPS = {
  V1_MONTHLY: {
    priceId: env.NEXT_PUBLIC_PREMIUM_MONTHLY_PRICE_ID,
    name: "Pro Collaborator - Monthly",
  },
  V1_ANNUALLY: {
    priceId: env.NEXT_PUBLIC_PREMIUM_YEARLY_PRICE_ID,
    name: "Pro Collaborator - Yearly",
  },
};
