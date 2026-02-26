import {Search, Bell,  Activity} from 'lucide-react';

const Header = () => {
    return (
        <header className="h-16 border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 bg-white z-10" style={{width: '100vw'}}>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                <div className="bg-blue-600 p-1 rounded text-white"><Activity size={20} /></div>
                MedSchedule
            </div>

            <div className="flex gap-6 items-center">
                <Search className="text-gray-400 cursor-pointer hover:text-gray-600" size={20} />
                <div className="relative">
                    <Bell className="text-gray-400 cursor-pointer hover:text-gray-600" size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-8 h-8 bg-gray-200 rounded-full border border-gray-100"></div>
                </div>
            </div>
        </header>
    );
}
export default Header;