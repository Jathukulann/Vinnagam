import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmenityIcons, HighlightIcons } from "@/lib/constants";
import { formatEnumString } from "@/lib/utils";
import { useGetPropertyQuery } from "@/state/api";
import { HelpCircle } from "lucide-react";
import React from "react";
import BookButton from "@/components/BookButton";

const PropertyDetails = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) {
    return <>Property not Found</>;
  }

  return (
    <div className="mb-6">
      {/* Book Button Section - Add this at the top */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-8 border border-blue-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ${property.pricePerMonth}/month
            </h3>
            <p className="text-gray-600">
              Security Deposit: ${property.securityDeposit} • Application Fee: ${property.applicationFee}
            </p>
          </div>
          <BookButton 
            propertyId={property.id} 
            price={property.pricePerMonth}
            variant="large"
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h2 className="text-xl font-semibold my-3">Property Amenities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {property.amenities.map((amenity: AmenityEnum) => {
            const Icon = AmenityIcons[amenity as AmenityEnum] || HelpCircle;
            return (
              <div
                key={amenity}
                className="flex flex-col items-center border rounded-xl py-8 px-4"
              >
                <Icon className="w-8 h-8 mb-2 text-gray-700" />
                <span className="text-sm text-center text-gray-700">
                  {formatEnumString(amenity)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights */}
      <div className="mt-12 mb-16">
        <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
          Highlights
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4 w-full">
          {property.highlights.map((highlight: HighlightEnum) => {
            const Icon =
              HighlightIcons[highlight as HighlightEnum] || HelpCircle;
            return (
              <div
                key={highlight}
                className="flex flex-col items-center border rounded-xl py-8 px-4"
              >
                <Icon className="w-8 h-8 mb-2 text-primary-600 dark:text-primary-300" />
                <span className="text-sm text-center text-primary-600 dark:text-primary-300">
                  {formatEnumString(highlight)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Section */}
      <div>
        <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100 mb-5">
          Fees and Policies
        </h3>
        <p className="text-sm text-primary-600 dark:text-primary-300 mt-2">
          The fees below are based on community-supplied data and may exclude
          additional fees and utilities.
        </p>
        <Tabs defaultValue="required-fees" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="required-fees">Required Fees</TabsTrigger>
            <TabsTrigger value="pets">Pets</TabsTrigger>
            <TabsTrigger value="parking">Parking</TabsTrigger>
          </TabsList>
          <TabsContent value="required-fees" className="w-1/3">
            <p className="font-semibold mt-5 mb-2">One time move in fees</p>
            <hr />
            <div className="flex justify-between py-2 bg-secondary-50">
              <span className="text-primary-700 font-medium">
                Application Fee
              </span>
              <span className="text-primary-700">
                ${property.applicationFee}
              </span>
            </div>
            <hr />
            <div className="flex justify-between py-2 bg-secondary-50">
              <span className="text-primary-700 font-medium">
                Security Deposit
              </span>
              <span className="text-primary-700">
                ${property.securityDeposit}
              </span>
            </div>
            <hr />
          </TabsContent>
          <TabsContent value="pets">
            <p className="font-semibold mt-5 mb-2">
              Pets are {property.isPetsAllowed ? "allowed" : "not allowed"}
            </p>
          </TabsContent>
          <TabsContent value="parking">
            <p className="font-semibold mt-5 mb-2">
              Parking is{" "}
              {property.isParkingIncluded ? "included" : "not included"}
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Book Button - Alternative placement */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold text-gray-900">Ready to book this property?</p>
            <p className="text-gray-600">Secure your spot today</p>
          </div>
          <BookButton 
            propertyId={property.id} 
            price={property.pricePerMonth}
            variant="large"
            className="w-full sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;