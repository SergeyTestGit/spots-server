const uuid = require("uuid");

module.exports.CATEGORIES = [
  {
    title: "Home Interior",
    iconName: "Home interior.png",
    orderKey: 0,
    subservices: [
      {
        _id: uuid.v4(),
        title: "Repair",
        orderKey: 1,
        iconName: "Home Interior-repair.png"
      },
      {
        _id: uuid.v4(),
        title: "Wallpaper",
        orderKey: 2,
        iconName: "Home Interior-wallpaper.png"
      },
      {
        _id: uuid.v4(),
        title: "Flooring",
        orderKey: 3,
        iconName: "Home Interior-flooring.png"
      },
      {
        _id: uuid.v4(),
        title: "Wall & celling",
        orderKey: 4,
        iconName: "Home Interior- Wall _ Ceiling.png"
      },
      {
        _id: uuid.v4(),
        title: "Window & doors",
        orderKey: 5,
        iconName: "Home Interior-Windows _ Doors.png"
      },
      {
        _id: uuid.v4(),
        title: "Lightning",
        orderKey: 6,
        iconName: "Home Interior-lighting.png"
      },
      {
        _id: uuid.v4(),
        title: "Other",
        orderKey: 7,
        iconName: "home interior-Other.png"
      }
    ]
  },
  {
    _id: uuid.v4(),
    title: "Home exterior",
    orderKey: 1,
    iconName: "Home Exterior.png",
    subservices: [
      {
        _id: uuid.v4(),
        title: "Pool service",
        orderKey: 0,
        iconName: "Home Exterior-Pool service.png"
      },
      {
        _id: uuid.v4(),
        title: "Tree service",
        orderKey: 1,
        iconName: "Home Exterior-Tree service.png"
      },
      {
        _id: uuid.v4(),
        title: "Fence",
        orderKey: 2,
        iconName: "Home Exterior-Fence.png"
      },
      {
        _id: uuid.v4(),
        title: "Trash removal",
        orderKey: 3,
        iconName: "Home Exterior-Trash removal.png"
      },
      {
        _id: uuid.v4(),
        title: "Other",
        orderKey: 4,
        iconName: "Home Exterior-Other.png"
      }
    ]
  },
  {
    _id: uuid.v4(),
    title: "Landscaping",
    orderKey: 2,
    iconName: "Landscaping.png"
  },
  {
    _id: uuid.v4(),
    title: "Handyman",
    orderKey: 3,
    iconName: "Handyman.png"
  },
  {
    _id: uuid.v4(),
    title: "Electrician",
    orderKey: 4,
    iconName: "Electrician.png"
  },
  {
    _id: uuid.v4(),
    title: "Plumbing",
    orderKey: 5,
    iconName: "plumbing.png"
  },
  {
    _id: uuid.v4(),
    title: "Painting",
    orderKey: 6,
    iconName: "Painting.png"
  },
  {
    _id: uuid.v4(),
    title: "Appliance repair",
    orderKey: 7,
    iconName: "Appliance Repair.png"
  },
  {
    _id: uuid.v4(),
    title: "Mounting & installing",
    orderKey: 8,
    iconName: "Mounting _ Installing.png"
  },
  {
    _id: uuid.v4(),
    title: "Furniture assembly",
    orderKey: 9,
    iconName: "Furniture Assembly.png"
  },
  {
    _id: uuid.v4(),
    title: "Cars & Vehicles",
    orderKey: 10,
    iconName: "Cars _ Vehicles.png",
    subservices: [
      {
        _id: uuid.v4(),
        title: "Repair",
        orderKey: 0,
        iconName: "Cars _ Vehicles-Repair.png"
      },
      {
        _id: uuid.v4(),
        title: "Service",
        orderKey: 1,
        iconName: "Cars _ Vehicles-Service.png"
      },
      {
        _id: uuid.v4(),
        title: "Driver",
        orderKey: 2,
        iconName: "Cars _ Vehicles-Driver.png"
      },
      {
        _id: uuid.v4(),
        title: "Other",
        orderKey: 3,
        iconName: "Cars _ Vehicles-Other.png"
      }
    ]
  },
  {
    _id: uuid.v4(),
    title: "Cleaning & Housework",
    orderKey: 11,
    iconName: "Cleaning _ Housework.png",
    subservices: [
      {
        _id: uuid.v4(),
        title: "Cleaning & Ironing",
        orderKey: 0,
        iconName: "Cleaning _ Housework- Cleaning _ Ironing.png"
      },
      {
        _id: uuid.v4(),
        title: "Seamstress",
        orderKey: 1,
        iconName: "Cleaning _ Housework-Seamstress.png"
      },
      {
        _id: uuid.v4(),
        title: "Other",
        orderKey: 2,
        iconName: "Cleaning _ Housework-other.png"
      }
    ]
  },
  {
    _id: uuid.v4(),
    title: "Moving / Delivery",
    orderKey: 12,
    iconName: "Moving _ Delivery.png"
  },
  {
    _id: uuid.v4(),
    title: "Beauty",
    orderKey: 13,
    iconName: "Beauty.png",
    subservices: [
      {
        _id: uuid.v4(),
        title: "Hair",
        orderKey: 0,
        iconName: "Beauty-hair.png"
      },
      {
        _id: uuid.v4(),
        title: "Manicure/Pedicure",
        orderKey: 1,
        iconName: "Beauty-Manicure _ Pedicure.png"
      },
      {
        _id: uuid.v4(),
        title: "Makeup",
        orderKey: 2,
        iconName: "Beauty-Makeup.png"
      },
      {
        _id: uuid.v4(),
        title: "Wax",
        orderKey: 3,
        iconName: "Beauty-Wax.png"
      },
      {
        _id: uuid.v4(),
        title: "Other",
        orderKey: 4,
        iconName: "Beauty-Other.png"
      }
    ]
  },
  {
    _id: uuid.v4(),
    title: "Relaxation",
    orderKey: 12,
    iconName: "Relaxation .png",
    subservices: [
      {
        _id: uuid.v4(),
        title: "Massage",
        orderKey: 0,
        iconName: "Relaxation-massage.png"
      },
      {
        _id: uuid.v4(),
        title: "Acupuncture",
        orderKey: 1,
        iconName: "Relaxation-acupuncture.png"
      },
      {
        _id: uuid.v4(),
        title: "Other",
        orderKey: 2,
        iconName: "Relaxation-Other.png"
      }
    ]
  },
  {
    _id: uuid.v4(),
    title: "Babysitting",
    orderKey: 14,
    iconName: "Babysitting .png"
  },
  {
    _id: uuid.v4(),
    title: "Pest control",
    orderKey: 15,
    iconName: "Painting.png"
  },
  {
    _id: uuid.v4(),
    title: "Adult care",
    orderKey: 16,
    iconName: "Adult care.png"
  },
  {
    _id: uuid.v4(),
    title: "Pet care",
    orderKey: 17,
    iconName: "Pet Care.png",
    subservices: [
      {
        _id: uuid.v4(),
        title: "Dog walking",
        orderKey: 0,
        iconName: "Pet Care-Dog Walking.png"
      },
      {
        _id: uuid.v4(),
        title: "Pet sitting",
        orderKey: 1,
        iconName: "pet care-Pet Sitting.png"
      },
      {
        _id: uuid.v4(),
        title: "Groomling",
        orderKey: 2,
        iconName: "pet care-Grooming.png"
      },
      {
        _id: uuid.v4(),
        title: "Boarding",
        orderKey: 3,
        iconName: "Pet Care-Boarding.png"
      },
      {
        _id: uuid.v4(),
        title: "Other",
        orderKey: 4,
        iconName: "Pet care-Other.png"
      }
    ]
  },
  {
    _id: uuid.v4(),
    title: "Carpool",
    orderKey: 18,
    iconName: "Carpool.png"
  },
  {
    _id: uuid.v4(),
    title: "Tutoring",
    orderKey: 19,
    iconName: "Tutoring.png"
  },
  {
    _id: uuid.v4(),
    title: "Tech & Computers",
    orderKey: 20,
    iconName: "Tech _ Computers.png"
  },
  {
    _id: uuid.v4(),
    title: "Document services",
    orderKey: 21,
    iconName: "Document Services.png"
  },
  {
    _id: uuid.v4(),
    title: "Running errands",
    orderKey: 22,
    iconName: "Running errands.png"
  },
  {
    _id: uuid.v4(),
    title: "Shopping",
    orderKey: 23,
    iconName: "shopping.png"
  },
  {
    _id: uuid.v4(),
    title: "Décor",
    orderKey: 24,
    iconName: "Décor.png"
  },
  {
    _id: uuid.v4(),
    title: "Fitness",
    orderKey: 25,
    iconName: "Fitness.png"
  },
  {
    _id: uuid.v4(),
    title: "Music & Dance",
    orderKey: 26,
    iconName: "Music _ Dance.png"
  },
  {
    _id: uuid.v4(),
    title: "Photo & video",
    orderKey: 27,
    iconName: "Photo _ video.png"
  },
  {
    _id: uuid.v4(),
    title: "Food",
    orderKey: 28,
    iconName: "food.png"
  },
  {
    _id: uuid.v4(),
    title: "Wine & gastronomy",
    orderKey: 29,
    iconName: "Wine _ gastronomy.png"
  },
  {
    _id: uuid.v4(),
    title: "Private Chef",
    orderKey: 30,
    iconName: "Private Chef.png"
  },
  {
    _id: uuid.v4(),
    title: "Concierge",
    orderKey: 31,
    iconName: "Concierge.png",
    subservices: [
      {
        _id: uuid.v4(),
        title: "Wait in line",
        orderKey: 0,
        iconName: "Concierge-Wait in line.png"
      },
      {
        _id: uuid.v4(),
        title: "Waiter",
        orderKey: 1,
        iconName: "Concierge-waiter.png"
      },
      {
        _id: uuid.v4(),
        title: "Cooking",
        orderKey: 2,
        iconName: "Concierge-Cooking.png"
      },
      {
        _id: uuid.v4(),
        title: "Assistant",
        orderKey: 3,
        iconName: "Concierge-Assistant.png"
      },
      {
        _id: uuid.v4(),
        title: "Other",
        orderKey: 4,
        iconName: "Concierge-Othe.png"
      }
    ]
  },
  {
    _id: uuid.v4(),
    title: "Event planning",
    orderKey: 32,
    iconName: "Event Planning.png",
    subservices: [
      {
        _id: uuid.v4(),
        title: "Planning",
        orderKey: 0,
        iconName: "Event planning-Planning.png"
      },
      {
        _id: uuid.v4(),
        title: "Decoration",
        orderKey: 1,
        iconName: "Event planning-Decoration.png"
      },
      {
        _id: uuid.v4(),
        title: "Cook",
        orderKey: 2,
        iconName: "Event planning-Cook.png"
      },
      {
        _id: uuid.v4(),
        title: "Barman",
        orderKey: 3,
        iconName: "Event planning-barman.png"
      },
      {
        _id: uuid.v4(),
        title: "Waiter",
        orderKey: 4,
        iconName: "event planning-waiter.png"
      },
      {
        _id: uuid.v4(),
        title: "Hostess",
        orderKey: 5,
        iconName: "Event planning-Hostess.png"
      },
      {
        _id: uuid.v4(),
        title: "DJ",
        orderKey: 6,
        iconName: "Event planning-DJ.png"
      },
      {
        _id: uuid.v4(),
        title: "Other",
        orderKey: 7,
        iconName: "Event planning-Other.png"
      }
    ]
  },
  {
    _id: uuid.v4(),
    orderKey: 33,
    title: "Other",
    iconName: "Other.png"
  }
];
