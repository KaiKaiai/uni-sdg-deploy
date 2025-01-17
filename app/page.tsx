"use client";
import React, { useState, useEffect } from "react";
import { Bell, User, Menu, Check, PlayCircle, Lock, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import NewsCarousel from "@/components/NewsCarousel";
import SDGGrid from "@/components/SDGGrid";
import { createClient } from "@/utils/supabase/client";
import { getUserRole } from "@/utils/getUserRole";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Trash2 } from 'lucide-react';
import DeleteModal from '@/components/DeleteModal';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
}

interface SDG {
  sdg_id: number;
  sdg_display_id: string;
  title: string;
  description: string;
}

interface UserSdgProgress {
  sdg_id: number;
  progress: 'todo' | 'doing' | 'done';
}

export default function Index() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [sdgs, setSdgs] = useState<SDG[]>([]);
  const [userSdgProgress, setUserSdgProgress] = useState<UserSdgProgress[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const isAdmin = userRole === "admin";

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sdgToDelete, setSdgToDelete] = useState<{ id: number; title: string } | null>(null);


  const sdgGoals = [
    { number: 1, title: 'No Poverty', description: 'End poverty in all its forms everywhere.' },
    { number: 2, title: 'Zero Hunger', description: 'End hunger, achieve food security and improved nutrition, and promote sustainable agriculture.' },
    { number: 3, title: 'Good Health and Well-being', description: 'Ensure healthy lives and promote well-being for all at all ages.' },
    { number: 4, title: 'Quality Education', description: 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.' },
    { number: 5, title: 'Gender Equality', description: 'Achieve gender equality and empower all women and girls.' },
    { number: 6, title: 'Clean Water And Sanitation', description: 'Ensure availability and sustainable management of water and sanitation for all.' },
    { number: 7, title: 'Affordable and Clean Energy', description: 'Ensure access to affordable, reliable, sustainable, and modern energy for all.' },
    { number: 8, title: 'Decent Work and Economic Growth', description: 'Promote sustained, inclusive and sustainable economic growth, full and productive employment, and decent work for all.' },
    { number: 9, title: 'Industry, Innovation, and Infrastructure', description: 'Build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation.' },
    { number: 10, title: 'Reduced Inequalities', description: 'Reduce inequality within and among countries.' },
    { number: 11, title: 'Sustainable Cities and Communities', description: 'Make cities and human settlements inclusive, safe, resilient, and sustainable.' },
    { number: 12, title: 'Responsible Consumption and Production', description: 'Ensure sustainable consumption and production patterns.' },
    { number: 13, title: 'Climate Action', description: 'Take urgent action to combat climate change and its impacts.' },
    { number: 14, title: 'Life Below Water', description: 'Conserve and sustainably use the oceans, seas, and marine resources for sustainable development.' },
    { number: 15, title: 'Life on Land', description: 'Protect, restore and promote sustainable use of terrestrial ecosystems, manage forests sustainably, combat desertification, and halt biodiversity loss.' },
    { number: 16, title: 'Peace, Justice, and Strong Institutions', description: 'Promote peaceful and inclusive societies, provide access to justice for all, and build effective, accountable institutions.' },
    { number: 17, title: 'Partnerships for the Goals', description: 'Strengthen the means of implementation and revitalize the global partnership for sustainable development.' }
  ];

  const [selectedGoal, setSelectedGoal] = useState({
    number: 6,
    title: 'Clean Water And Sanitation',
    description: 'Ensure availability and sustainable management of water and sanitation for all.',
  });

  const handleDeleteSDG = async (sdgId: number) => {
    try {
      const { error } = await supabase
        .from('sdgs')
        .delete()
        .eq('sdg_id', sdgId);
  
      if (error) throw error;
      
      // Refresh the SDGs list
      fetchSdgs();
      setIsDeleteModalOpen(false);
      setSdgToDelete(null);
    } catch (error) {
      console.error('Error deleting SDG:', error);
    }
  };


  const fetchUserSdgProgress = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("usersdgprogress")
        .select('sdg_id, progress')
        .eq("user_id", userId);
  
      if (error) {
        console.error("Error fetching user SDG progress:", error);
        return;
      }
  
      if (data) {
        setUserSdgProgress(data.map(item => ({
          sdg_id: item.sdg_id,
          progress: item.progress || 'todo'
        })));
      }
    } catch (error) {
      console.error("Error in fetchUserSdgProgress:", error);
    }
  };

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [dataLoaded, setDataLoaded] = useState({
    user: false,
    sdgs: false,
    progress: false,
    news: false
  });

  // Modify the useEffect for user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setDataLoaded(prev => ({ ...prev, user: true }));
          
          // Fetch SDGs
          const sdgsResponse = await fetch('/api/sdgs');
          if (sdgsResponse.ok) {
            const sdgsData = await sdgsResponse.json();
            setSdgs(sdgsData);
            setDataLoaded(prev => ({ ...prev, sdgs: true }));
          }

          // Fetch user progress
          const { data: progressData, error } = await supabase
            .from("usersdgprogress")
            .select('sdg_id, progress')
            .eq("user_id", user.id);

          if (!error && progressData) {
            setUserSdgProgress(progressData.map(item => ({
              sdg_id: item.sdg_id,
              progress: item.progress || 'todo'
            })));
            setDataLoaded(prev => ({ ...prev, progress: true }));
          }

          // Get user role
          const role = await getUserRole(supabase);
          setUserRole(role);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [supabase, router]);

  useEffect(() => {
    const fetchSDGNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        setArticles(data.articles.slice(0, 10)); // Only take first 10 articles
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchSDGNews();
  }, []);

  const fetchSdgs = async () => {
    try {
      const response = await fetch('/api/sdgs');
      if (!response.ok) {
        throw new Error('Failed to fetch SDGs');
      }
      const data = await response.json();
      setSdgs(data);
    } catch (error) {
      console.error("Error fetching SDGs:", error);
    }
  };



  const getSdgProgress = (sdgId: number): 'todo' | 'doing' | 'done' => {
    const progress = userSdgProgress.find((p) => p.sdg_id === sdgId);
    return progress ? progress.progress : 'todo';
  };

  const handleSelectGoal = (goal: { number: number }) => {
    const newGoal = sdgGoals[goal.number - 1];
    setSelectedGoal({
      number: goal.number,
      title: newGoal.title,
      description: newGoal.description,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-default md:flex-row">
      {/* Mobile menu button */}
      {/* Do we still need this if we don't have sidebar anymore */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 bg-surface rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>
      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8 md:ml-0">
     
        {/* Hero Section */}
        <div id="Dashboard" className="mb-6">
          <h1>Sustainable Development Goals</h1>
          <div className="bg-blue-800 p-4 rounded-lg flex flex-row gap-8">
            <div className="w-[600px]">
              <SDGGrid onSelectGoal={handleSelectGoal} />
            </div>
            {/* Goal # */}
            <div className="flex flex-col justify-center">
              <h2 className="h-fit text-[80px] text-inverse">{selectedGoal.number}</h2>
            </div>
            {/* Goal Text */}
            <div className="flex flex-col gap-4 justify-center py-8 px-4">
              <h3 className="text-inverse">{selectedGoal.title}</h3>
              <p className="text-inverse max-w-[500px]">{selectedGoal.description}</p>
              <div className="flex flex-row justify-end">
                {/* <button className="btn-primary">
                  Learn more
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Module Progress */}
        {/* <div className="mb-8 overflow-x-auto">
          <div className="flex justify-between items-center mb-2 min-w-max">
            <div className="text-subtler">Newbie</div>
            <div className="text-default">Master</div>
          </div>
          <div className="h-2 bg-surface rounded-full">
            <div className="h-full w-1/2 bg-sdg-6 rounded-full"></div>
          </div>
        </div> */}

        {/* SDG Modules */}
        <div id="SDG" className="py-8">
          <h2>Goals</h2>
          {isAdmin && (
          <div className="mb-6">
            <Link
              href="/builder"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New SDG
            </Link>
          </div>
        )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
          {sdgs.map((sdg) => {
            const progress = getSdgProgress(sdg.sdg_id);
            return (
              <div
                key={sdg.sdg_id}
                className={`relative bg-surface rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
                  progress === 'doing' ? "opacity-75" : ""
                }`}
              >
                <div className="p-4 flex items-start">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 text-inverse`}
                    style={{ backgroundColor: `var(--sdg-${sdg.sdg_id})` }}
                  >
                    {sdg.sdg_display_id}
                  </div>
                  <div 
                    className="flex-grow"
                    onClick={() => !progress.includes('doing') && router.push(`/sdg/${sdg.sdg_id}`)}
                  >
                    <h6>{sdg.title}</h6>
                    <p className="caption">{sdg.description}</p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex items-center">
                    {progress === 'done' && <Check className="h-5 w-5 text-green-500" />}
                    {progress === 'doing' && <PlayCircle className="h-5 w-5 text-blue-500" />}
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSdgToDelete({ id: sdg.sdg_id, title: sdg.title });
                          setIsDeleteModalOpen(true);
                        }}
                        className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
                {progress === 'doing' && (
                  <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-inverse" />
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>

        {/* Daily News */}
        <div className="mb-4 pb-4">
          <h2>Daily News</h2>
          <p>
            Keep up to date with the latest news on Sustainable Development
            Goals. Check out the latest articles, events, and updates related to
            the SDGs!
          </p>
        </div>


        {/* News Carousel Section */}
        {articles.length > 0 ? (
          <NewsCarousel articles={articles} />
        ) : (
          <div className="flex flex-row justify-center items-start h-[360px] px-6 py-4 gap-8 mb-4">
            <NewsCard 
              img="/EVAC-header-desktop.jpg"
              title="End Child Violence"
              description="1 in 2 children are victims of violence. The power to end it is in our hands."
              href="https://www.globalgoals.org/endchildviolence/"
            />
            <NewsCard 
              img="/news-article-2.jpg"
              title="Makes Global Sense"
              description="If you had to choose between coffee and bread, which would it be?"
              href="https://www.globalgoals.org/makestotalsense/"
            />
            <NewsCard 
              img="/news-article-3.jpg"
              title="Global Goals"
              description="What are the global goals?"
              href="https://www.globalgoals.org/news/what-are-the-global-goals/"
            />
          </div>
        )}
        <Footer />
        {sdgToDelete && (
          <DeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSdgToDelete(null);
            }}
            onConfirm={() => handleDeleteSDG(sdgToDelete.id)}
            sdgTitle={sdgToDelete.title}
          />
        )}
      </main>
    </div>
  );
}