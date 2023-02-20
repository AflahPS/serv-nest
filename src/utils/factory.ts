import { Model } from 'mongoose';
import { thrower } from './error.thrower';
import { returner } from './returner';
import * as moment from 'moment';

export const lastWeekMade = async (model: Model<any>) => {
  try {
    const today = new Date();
    const lastWeekStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7,
    );
    const start = new Date(lastWeekStart.setHours(0, 0, 0, 0));
    const count = await model.aggregate([
      {
        $match: {
          createdAt: { $gte: start },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    return returner({ count: count[0]?.total || 0 });
  } catch (err) {
    thrower(err);
  }
};

export const monthlyMade = async (model: Model<any>) => {
  try {
    const thisYear = [];
    for (let i = 0; i < 12; ++i) {
      const thisYear1 = moment().startOf('year');
      const thisYear2 = moment().startOf('year');
      const newObj = {
        start: thisYear1.add(i, 'months').startOf('month').toDate(),
        end: thisYear2.add(i, 'months').endOf('month').toDate(),
      };
      thisYear.push(newObj);
    }

    const result = await Promise.all(
      thisYear.map(
        async (el) =>
          await model.aggregate([
            {
              $match: { createdAt: { $gte: el.start, $lte: el.end } },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
            {
              $project: { _id: 0 },
            },
          ]),
      ),
    );
    const finalData = result.map((el) => (el[0] ? el[0].count : 0));
    return returner({ data: finalData });
  } catch (err) {
    thrower(err);
  }
};
