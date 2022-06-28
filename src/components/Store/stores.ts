import dataStore from '@/components/Store/dataStore';
import scheduleStore from '@/components/Store/scheduleStore';
import reactive from '@/components/Store/Store';
import { IStores } from '@/core/Feact/feactTypes';
// собираем все сторы в один большой стор
const stores: IStores = {
	schedulerStore: reactive(scheduleStore),
	dataStore: reactive(dataStore),
};

export default stores;
